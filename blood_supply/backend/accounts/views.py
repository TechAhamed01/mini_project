from django.shortcuts import render

# Create your views here.
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer,
    UserProfileSerializer, DonorHealthInfoSerializer
)
from .models import DonorHealthInfo
from inventory.models import BloodRequest, BloodType
from notifications.models import Notification

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User registered successfully',
                'user_id': user.id,
                'user_type': user.user_type
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    serializer_class = UserLoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        tokens = serializer.get_tokens(user)
        
        return Response({
            'message': 'Login successful',
            **tokens,
            'user': UserProfileSerializer(user).data
        })

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        data = {}
        
        if user.user_type == 'HOSPITAL':
            # Hospital dashboard data
            pending_requests = BloodRequest.objects.filter(
                hospital=user,
                status='PENDING'
            ).count()
            
            fulfilled_requests = BloodRequest.objects.filter(
                hospital=user,
                status='FULFILLED'
            ).count()
            
            if user.has_blood_bank:
                inventory = BloodType.objects.filter(blood_bank=user)
                total_units = inventory.aggregate(models.Sum('quantity'))['quantity__sum'] or 0
                expiring_soon = inventory.filter(expiry_date__lte=timezone.now() + timedelta(days=7)).count()
            else:
                total_units = 0
                expiring_soon = 0
            
            data = {
                'pending_requests': pending_requests,
                'fulfilled_requests': fulfilled_requests,
                'total_inventory_units': total_units,
                'expiring_soon_count': expiring_soon,
                'unread_notifications': Notification.objects.filter(user=user, is_read=False).count()
            }
            
        elif user.user_type == 'BLOOD_BANK':
            # Blood bank dashboard data
            inventory = BloodType.objects.filter(blood_bank=user)
            total_units = inventory.aggregate(models.Sum('quantity'))['quantity__sum'] or 0
            
            blood_groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
            inventory_by_group = {}
            
            for bg in blood_groups:
                units = inventory.filter(blood_group=bg).aggregate(
                    models.Sum('quantity')
                )['quantity__sum'] or 0
                inventory_by_group[bg] = units
            
            pending_requests = BloodRequest.objects.filter(
                status='PENDING'
            ).count()
            
            expiring_soon = inventory.filter(
                expiry_date__lte=timezone.now() + timedelta(days=7)
            ).count()
            
            data = {
                'total_inventory_units': total_units,
                'inventory_by_blood_group': inventory_by_group,
                'pending_requests': pending_requests,
                'expiring_soon_count': expiring_soon,
                'unread_notifications': Notification.objects.filter(user=user, is_read=False).count()
            }
            
        elif user.user_type == 'DONOR':
            # Donor dashboard data
            donations = BloodType.objects.filter(donor=user)
            total_donations = donations.count()
            last_donation = donations.order_by('-collection_date').first()
            
            upcoming_requests = BloodRequest.objects.filter(
                blood_group=user.blood_group,
                status='PENDING',
                hospital__city=user.city
            ).count()
            
            data = {
                'total_donations': total_donations,
                'last_donation_date': last_donation.collection_date if last_donation else None,
                'upcoming_requests': upcoming_requests,
                'unread_notifications': Notification.objects.filter(user=user, is_read=False).count()
            }
        
        return Response(data)

class DonorHealthInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = DonorHealthInfoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        user = self.request.user
        if user.user_type != 'DONOR':
            raise PermissionDenied("Only donors can access health information")
        
        obj, created = DonorHealthInfo.objects.get_or_create(donor=user)
        return obj