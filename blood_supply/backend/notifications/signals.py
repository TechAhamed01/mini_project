from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from inventory.models import BloodType, BloodRequest
from accounts.models import User
from .models import Notification

@receiver(post_save, sender=BloodType)
def check_blood_expiry(sender, instance, **kwargs):
    """Create expiry notification for blood nearing expiry"""
    if instance.is_expiring_soon() and instance.days_until_expiry > 0:
        Notification.objects.create(
            user=instance.blood_bank,
            notification_type='EXPIRY_ALERT',
            title=f'Blood Expiring Soon - {instance.blood_group}',
            message=f'{instance.quantity} units of {instance.blood_group} {instance.component_type} will expire in {instance.days_until_expiry} days.',
            blood_inventory=instance
        )

@receiver(post_save, sender=BloodRequest)
def notify_blood_request_update(sender, instance, **kwargs):
    """Create notification when blood request status changes"""
    if instance.status == 'FULFILLED' and instance.fulfilled_by:
        Notification.objects.create(
            user=instance.hospital,
            notification_type='REQUEST_UPDATE',
            title='Request Fulfilled',
            message=f'Your request for {instance.blood_group} has been fulfilled by {instance.fulfilled_by.blood_bank_name}',
            blood_request=instance
        )

@receiver(post_save, sender=BloodType)
def check_low_stock(sender, instance, **kwargs):
    """Create low stock notification"""
    if instance.quantity <= 5:  # Threshold for low stock
        Notification.objects.create(
            user=instance.blood_bank,
            notification_type='LOW_STOCK',
            title=f'Low Stock Alert - {instance.blood_group}',
            message=f'Only {instance.quantity} units of {instance.blood_group} {instance.component_type} remaining.',
            blood_inventory=instance
        )