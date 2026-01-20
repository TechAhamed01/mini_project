from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, DonorHealthInfo

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2', 'user_type',
            'first_name', 'last_name', 'phone', 'address', 'city', 
            'state', 'country', 'pincode', 'latitude', 'longitude',
            'hospital_name', 'has_blood_bank', 'license_number',
            'blood_bank_name', 'blood_bank_license',
            'blood_group', 'date_of_birth'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields don't match."})
        
        user_type = attrs.get('user_type')
        
        if user_type == 'HOSPITAL':
            if not attrs.get('hospital_name'):
                raise serializers.ValidationError({"hospital_name": "Hospital name is required for hospitals."})
        
        elif user_type == 'BLOOD_BANK':
            if not attrs.get('blood_bank_name'):
                raise serializers.ValidationError({"blood_bank_name": "Blood bank name is required for blood banks."})
        
        elif user_type == 'DONOR':
            if not attrs.get('blood_group'):
                raise serializers.ValidationError({"blood_group": "Blood group is required for donors."})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
            
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            
        else:
            raise serializers.ValidationError('Must include "username" and "password".')
        
        attrs['user'] = user
        return attrs
    
    def get_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_type': user.user_type,
        }

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'user_type', 'first_name', 'last_name',
            'phone', 'address', 'city', 'state', 'country', 'pincode',
            'latitude', 'longitude', 'hospital_name', 'has_blood_bank',
            'blood_bank_name', 'blood_group', 'date_of_birth',
            'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class DonorHealthInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonorHealthInfo
        fields = '__all__'
        read_only_fields = ['donor']