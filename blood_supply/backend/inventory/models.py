

# Create your models here.
from django.db import models
from accounts.models import User

class BloodType(models.Model):
    BLOOD_GROUP_CHOICES = (
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
    )
    
    BLOOD_COMPONENT_CHOICES = (
        ('WHOLE_BLOOD', 'Whole Blood'),
        ('RBC', 'Red Blood Cells'),
        ('PLASMA', 'Plasma'),
        ('PLATELETS', 'Platelets'),
        ('CRYOPRECIPITATE', 'Cryoprecipitate'),
    )
    
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('RESERVED', 'Reserved'),
        ('USED', 'Used'),
        ('EXPIRED', 'Expired'),
        ('TESTING', 'Testing'),
    )
    
    blood_group = models.CharField(max_length=5, choices=BLOOD_GROUP_CHOICES)
    component_type = models.CharField(max_length=20, choices=BLOOD_COMPONENT_CHOICES)
    quantity = models.IntegerField(help_text="Quantity in units")
    unit_volume = models.FloatField(default=450, help_text="Volume per unit in ml")
    
    # Source information
    blood_bank = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blood_inventory')
    donor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    
    # Storage information
    collection_date = models.DateField()
    expiry_date = models.DateField()
    storage_temperature = models.FloatField(help_text="Storage temperature in Celsius")
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    batch_number = models.CharField(max_length=100, unique=True)
    test_results = models.FileField(upload_to='test_results/', blank=True, null=True)
    is_tested = models.BooleanField(default=False)
    test_date = models.DateField(null=True, blank=True)
    
    # Location
    storage_location = models.CharField(max_length=255, help_text="Specific storage location in facility")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Blood Inventory"
        verbose_name_plural = "Blood Inventory"
        ordering = ['expiry_date', 'blood_group']
    
    def __str__(self):
        return f"{self.blood_group} - {self.component_type} - {self.quantity} units"
    
    def is_expiring_soon(self):
        from datetime import date, timedelta
        return self.expiry_date <= date.today() + timedelta(days=7)
    
    @property
    def days_until_expiry(self):
        from datetime import date
        return (self.expiry_date - date.today()).days

class BloodRequest(models.Model):
    REQUEST_STATUS = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('FULFILLED', 'Fulfilled'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    )
    
    PRIORITY_CHOICES = (
        ('LOW', 'Low Priority'),
        ('MEDIUM', 'Medium Priority'),
        ('HIGH', 'High Priority'),
        ('CRITICAL', 'Critical Emergency'),
    )
    
    hospital = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blood_requests')
    blood_group = models.CharField(max_length=5, choices=BloodType.BLOOD_GROUP_CHOICES)
    component_type = models.CharField(max_length=20, choices=BloodType.BLOOD_COMPONENT_CHOICES)
    quantity_required = models.IntegerField()
    urgency = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    
    # Request details
    patient_details = models.TextField(blank=True)
    purpose = models.CharField(max_length=255, blank=True)
    required_by = models.DateTimeField()
    
    # Fulfillment details
    status = models.CharField(max_length=20, choices=REQUEST_STATUS, default='PENDING')
    fulfilled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='fulfilled_requests')
    fulfilled_quantity = models.IntegerField(default=0)
    fulfilled_at = models.DateTimeField(null=True, blank=True)
    
    # AI matching results
    suggested_blood_banks = models.JSONField(default=list, blank=True)
    ai_confidence_score = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Request #{self.id} - {self.hospital.username} - {self.blood_group}"