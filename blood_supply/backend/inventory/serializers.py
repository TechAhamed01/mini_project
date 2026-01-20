from rest_framework import serializers
from .models import BloodType, BloodRequest
from accounts.serializers import UserProfileSerializer

class BloodTypeSerializer(serializers.ModelSerializer):
    blood_bank_details = UserProfileSerializer(source='blood_bank', read_only=True)
    donor_details = UserProfileSerializer(source='donor', read_only=True)
    is_expiring_soon = serializers.BooleanField(read_only=True)
    days_until_expiry = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = BloodType
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class BloodRequestSerializer(serializers.ModelSerializer):
    hospital_details = UserProfileSerializer(source='hospital', read_only=True)
    fulfilled_by_details = UserProfileSerializer(source='fulfilled_by', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    urgency_display = serializers.CharField(source='get_urgency_display', read_only=True)
    
    class Meta:
        model = BloodRequest
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at', 'hospital']

class BloodRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodRequest
        fields = [
            'blood_group', 'component_type', 'quantity_required',
            'urgency', 'patient_details', 'purpose', 'required_by'
        ]
    
    def create(self, validated_data):
        validated_data['hospital'] = self.context['request'].user
        return super().create(validated_data)