from django.db import models
from accounts.models import User

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('LOW_STOCK', 'Low Stock Alert'),
        ('EXPIRY_ALERT', 'Expiry Alert'),
        ('REQUEST_UPDATE', 'Request Status Update'),
        ('DONOR_MATCH', 'Donor Match Found'),
        ('EMERGENCY_REQUEST', 'Emergency Blood Request'),
        ('SYSTEM_ALERT', 'System Alert'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    # Related objects
    blood_inventory = models.ForeignKey('inventory.BloodType', on_delete=models.SET_NULL, null=True, blank=True)
    blood_request = models.ForeignKey('inventory.BloodRequest', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    sent_via = models.CharField(max_length=50, default='IN_APP', choices=(('IN_APP', 'In App'), ('EMAIL', 'Email'), ('SMS', 'SMS')))
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]
    
    def __str__(self):
        return f"{self.notification_type} - {self.user.username}"