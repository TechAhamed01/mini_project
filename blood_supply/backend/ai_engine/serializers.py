from rest_framework import serializers
from .models import AIPredictiveModel

class AIPredictiveModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIPredictiveModel
        fields = '__all__'
        read_only_fields = ['trained_at']

class DemandPredictionSerializer(serializers.Serializer):
    location = serializers.JSONField()
    blood_group = serializers.CharField(max_length=5)
    component_type = serializers.CharField(max_length=20)
    days_ahead = serializers.IntegerField(default=7, min_value=1, max_value=30)

class ExpiryPredictionSerializer(serializers.Serializer):
    blood_inventory_id = serializers.IntegerField()