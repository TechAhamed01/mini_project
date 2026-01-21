from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    created_at_formatted = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'notification_type_display',
            'title', 'message', 'is_read', 'sent_via',
            'created_at', 'created_at_formatted', 'read_at'
        ]
        read_only_fields = ['created_at', 'read_at']