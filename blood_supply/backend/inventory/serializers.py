from rest_framework import serializers
from .models import BloodType, BloodRequest
from accounts.serializers import UserProfileSerializer
from datetime import datetime, timedelta
import uuid

class BloodTypeSerializer(serializers.ModelSerializer):
    blood_bank_details = UserProfileSerializer(source='blood_bank', read_only=True)
    donor_details = UserProfileSerializer(source='donor', read_only=True)
    is_expiring_soon = serializers.BooleanField(read_only=True)
    days_until_expiry = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = BloodType
        fields = [
            'id', 'blood_group', 'component_type', 'quantity', 'unit_volume',
            'collection_date', 'expiry_date', 'storage_temperature', 'storage_location',
            'batch_number', 'status', 'is_tested', 'test_date', 'test_results',
            'blood_bank', 'blood_bank_details', 'donor', 'donor_details',
            'is_expiring_soon', 'days_until_expiry', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'batch_number', 'blood_bank', 'blood_bank_details', 'donor_details']
        extra_kwargs = {
            'unit_volume': {'required': False, 'default': 450},
            'status': {'required': False, 'default': 'AVAILABLE'},
            'is_tested': {'required': False, 'default': False},
            'test_date': {'required': False, 'allow_null': True},
            'test_results': {'required': False, 'allow_null': True},
            'donor': {'required': False, 'allow_null': True},
        }
    
    def create(self, validated_data):
        # Auto-generate batch number if not provided
        if 'batch_number' not in validated_data or not validated_data.get('batch_number'):
            blood_group = validated_data.get('blood_group', 'UN')
            component = validated_data.get('component_type', 'UNK')[:3].upper()
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            unique_id = str(uuid.uuid4())[:8].upper()
            validated_data['batch_number'] = f"{blood_group}-{component}-{timestamp}-{unique_id}"
        
        # Set defaults for optional fields
        if 'unit_volume' not in validated_data or not validated_data['unit_volume']:
            validated_data['unit_volume'] = 450
        if 'status' not in validated_data or not validated_data['status']:
            validated_data['status'] = 'AVAILABLE'
        if 'is_tested' not in validated_data:
            validated_data['is_tested'] = False
        
        print(f"DEBUG: Creating BloodType with data: {validated_data}")
        return super().create(validated_data)

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