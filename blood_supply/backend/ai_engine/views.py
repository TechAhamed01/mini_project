from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import AIPredictiveModel, BloodSupplyChainAI
from inventory.models import BloodType
from .serializers import (
    AIPredictiveModelSerializer,
    DemandPredictionSerializer,
    ExpiryPredictionSerializer
)

class AIPredictiveModelListView(generics.ListAPIView):
    serializer_class = AIPredictiveModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = AIPredictiveModel.objects.filter(is_active=True)

class DemandPredictionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = DemandPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ai_engine = BloodSupplyChainAI()
            prediction = ai_engine.predict_demand(**serializer.validated_data)
            
            return Response({
                'success': True,
                'prediction': prediction
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ExpiryPredictionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ExpiryPredictionSerializer(data=request.data)
        if serializer.is_valid():
            blood_inventory = get_object_or_404(
                BloodType, 
                id=serializer.validated_data['blood_inventory_id'],
                blood_bank=request.user
            )
            
            ai_engine = BloodSupplyChainAI()
            prediction = ai_engine.predict_expiry_risk(blood_inventory)
            
            return Response({
                'success': True,
                'prediction': prediction
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DonorMatchingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        blood_group = request.data.get('blood_group')
        location = request.data.get('location')
        
        if not blood_group or not location:
            return Response(
                {'error': 'Blood group and location are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ai_engine = BloodSupplyChainAI()
        
        # Create temporary request for matching
        from inventory.models import BloodRequest
        temp_request = BloodRequest(
            hospital=request.user,
            blood_group=blood_group,
            component_type='WHOLE_BLOOD',
            quantity_required=1
        )
        
        if location.get('latitude') and location.get('longitude'):
            temp_request.hospital.latitude = location['latitude']
            temp_request.hospital.longitude = location['longitude']
        
        matches = ai_engine.match_donors_for_request(temp_request)
        
        return Response({
            'success': True,
            'total_matches': len(matches),
            'donors': matches
        })

class NearestBloodBanksView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        blood_group = request.data.get('blood_group')
        component_type = request.data.get('component_type', 'WHOLE_BLOOD')
        quantity = int(request.data.get('quantity', 1))
        location = request.data.get('location')
        
        if not all([blood_group, location]):
            return Response(
                {'error': 'Blood group and location are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ai_engine = BloodSupplyChainAI()
        suggestions = ai_engine.find_nearest_blood_banks(
            request_location=location,
            blood_group=blood_group,
            component_type=component_type,
            quantity=quantity
        )
        
        return Response({
            'success': True,
            'total_suggestions': len(suggestions),
            'suggestions': suggestions
        })