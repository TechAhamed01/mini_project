from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.contrib.auth import get_user_model
from .models import BloodType, BloodRequest
from .serializers import (
    BloodTypeSerializer, BloodRequestSerializer, BloodRequestCreateSerializer
)
from ai_engine.models import BloodSupplyChainAI
from notifications.models import Notification

User = get_user_model()

class BloodInventoryView(generics.ListCreateAPIView):
    serializer_class = BloodTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['blood_group', 'component_type', 'status']
    
    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == 'BLOOD_BANK':
            return BloodType.objects.filter(blood_bank=user)
        elif user.user_type == 'HOSPITAL' and user.has_blood_bank:
            return BloodType.objects.filter(blood_bank=user)
        else:
            # For hospitals without blood bank and donors, show empty
            return BloodType.objects.none()
    
    def perform_create(self, serializer):
        user = self.request.user
        
        # Debug logging
        print(f"DEBUG: User attempting to add inventory - Username: {user.username}, User Type: {user.user_type}")
        
        # Check if user is authorized to add inventory
        if user.user_type == 'BLOOD_BANK':
            print(f"DEBUG: User is BLOOD_BANK, proceeding with save")
            serializer.save(blood_bank=user)
        elif user.user_type == 'HOSPITAL' and user.has_blood_bank:
            print(f"DEBUG: User is HOSPITAL with blood bank, proceeding with save")
            serializer.save(blood_bank=user)
        else:
            error_msg = f"User {user.username} (type: {user.user_type}) is not authorized to add inventory"
            print(f"DEBUG: Permission Denied - {error_msg}")
            raise PermissionDenied(error_msg)

class BloodSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        blood_group = request.data.get('blood_group')
        component_type = request.data.get('component_type')
        quantity = int(request.data.get('quantity', 1))
        
        if not all([blood_group, component_type]):
            return Response(
                {'error': 'Blood group and component type are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = request.user
        ai_engine = BloodSupplyChainAI()
        
        # Get AI suggestions for nearest blood banks
        suggestions = ai_engine.find_nearest_blood_banks(
            request_location={
                'latitude': user.latitude or 0,
                'longitude': user.longitude or 0
            },
            blood_group=blood_group,
            component_type=component_type,
            quantity=quantity
        )
        
        # Get donor matches if no blood banks found
        donor_matches = []
        if not suggestions:
            # Create temporary request for donor matching
            temp_request = BloodRequest(
                hospital=user,
                blood_group=blood_group,
                component_type=component_type,
                quantity_required=quantity
            )
            donor_matches = ai_engine.match_donors_for_request(temp_request)
        
        return Response({
            'blood_bank_suggestions': suggestions,
            'donor_matches': donor_matches,
            'search_parameters': {
                'blood_group': blood_group,
                'component_type': component_type,
                'quantity': quantity
            }
        })

class BloodRequestView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BloodRequestCreateSerializer
        return BloodRequestSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        if user.user_type == 'HOSPITAL':
            return BloodRequest.objects.filter(hospital=user)
        elif user.user_type == 'BLOOD_BANK':
            # Blood banks can see requests in their city
            return BloodRequest.objects.filter(
                Q(status='PENDING') | Q(fulfilled_by=user),
                hospital__city=user.city
            )
        else:
            return BloodRequest.objects.none()
    
    def perform_create(self, serializer):
        request_obj = serializer.save()
        
        # Create notification for blood banks in the same city
        blood_banks = User.objects.filter(
            user_type='BLOOD_BANK',
            city=request_obj.hospital.city,
            is_verified=True
        )
        
        for blood_bank in blood_banks:
            Notification.objects.create(
                user=blood_bank,
                notification_type='EMERGENCY_REQUEST',
                title=f'New Blood Request - {request_obj.blood_group}',
                message=f'Hospital {request_obj.hospital.hospital_name} needs {request_obj.quantity_required} units of {request_obj.blood_group} {request_obj.component_type}',
                blood_request=request_obj
            )
        
        # Use AI to find suggestions
        ai_engine = BloodSupplyChainAI()
        suggestions = ai_engine.find_nearest_blood_banks(
            request_location={
                'latitude': request_obj.hospital.latitude or 0,
                'longitude': request_obj.hospital.longitude or 0
            },
            blood_group=request_obj.blood_group,
            component_type=request_obj.component_type,
            quantity=request_obj.quantity_required
        )
        
        request_obj.suggested_blood_banks = suggestions
        request_obj.save()

class FulfillRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, request_id):
        try:
            blood_request = BloodRequest.objects.get(id=request_id, status='PENDING')
            user = request.user
            
            if user.user_type != 'BLOOD_BANK':
                return Response(
                    {'error': 'Only blood banks can fulfill requests'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            # Check if blood bank has required blood
            required_blood = BloodType.objects.filter(
                blood_bank=user,
                blood_group=blood_request.blood_group,
                component_type=blood_request.component_type,
                quantity__gte=blood_request.quantity_required,
                status='AVAILABLE'
            ).first()
            
            if not required_blood:
                return Response(
                    {'error': 'Insufficient inventory'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update inventory
            required_blood.quantity -= blood_request.quantity_required
            if required_blood.quantity == 0:
                required_blood.status = 'USED'
            required_blood.save()
            
            # Update request
            blood_request.status = 'FULFILLED'
            blood_request.fulfilled_by = user
            blood_request.fulfilled_quantity = blood_request.quantity_required
            blood_request.fulfilled_at = timezone.now()
            blood_request.save()
            
            # Create notifications
            Notification.objects.create(
                user=blood_request.hospital,
                notification_type='REQUEST_UPDATE',
                title='Request Fulfilled',
                message=f'Your blood request has been fulfilled by {user.blood_bank_name}',
                blood_request=blood_request
            )
            
            return Response({
                'message': 'Request fulfilled successfully',
                'request_id': blood_request.id
            })
            
        except BloodRequest.DoesNotExist:
            return Response(
                {'error': 'Request not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class ExpiryAlertView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if user.user_type not in ['BLOOD_BANK', 'HOSPITAL']:
            return Response(
                {'error': 'Only blood banks and hospitals can view expiry alerts'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        expiring_blood = BloodType.objects.filter(
            blood_bank=user,
            expiry_date__lte=timezone.now() + timedelta(days=7),
            expiry_date__gte=timezone.now()
        )
        
        ai_engine = BloodSupplyChainAI()
        alerts = []
        
        for blood in expiring_blood:
            risk_analysis = ai_engine.predict_expiry_risk(blood)
            alerts.append({
                'blood_id': blood.id,
                'blood_group': blood.blood_group,
                'component_type': blood.component_type,
                'quantity': blood.quantity,
                'expiry_date': blood.expiry_date,
                'days_until_expiry': blood.days_until_expiry,
                'risk_analysis': risk_analysis
            })
        
        return Response({
            'total_expiring': len(alerts),
            'alerts': alerts
        })