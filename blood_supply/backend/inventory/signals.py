"""
Signals for inventory app
"""
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import BloodType, BloodRequest

# Example: Update stock levels when blood is added
@receiver(post_save, sender=BloodType)
def update_stock_on_blood_add(sender, instance, created, **kwargs):
    if created:
        # Update stock logic here
        pass

# Example: Log inventory changes
@receiver(pre_save, sender=BloodType)
def log_blood_changes(sender, instance, **kwargs):
    if instance.pk:  # Only for updates, not creations
        old_instance = BloodType.objects.get(pk=instance.pk)
        # Compare and log changes
        pass