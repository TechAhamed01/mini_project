

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = (
        ('HOSPITAL', 'Hospital'),
        ('BLOOD_BANK', 'Blood Bank'),
        ('DONOR', 'Donor'),
    )
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',
        blank=True
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    phone = models.CharField(max_length=15, unique=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='India')
    pincode = models.CharField(max_length=10)
    
    # Location fields (using PointField for geolocation)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Hospital specific fields
    hospital_name = models.CharField(max_length=255, blank=True, null=True)
    license_number = models.CharField(max_length=100, blank=True, null=True)
    has_blood_bank = models.BooleanField(default=False)
    
    # Blood Bank specific fields
    blood_bank_name = models.CharField(max_length=255, blank=True, null=True)
    blood_bank_license = models.CharField(max_length=100, blank=True, null=True)
    
    # Donor specific fields
    blood_group = models.CharField(max_length=5, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    last_donation_date = models.DateField(blank=True, null=True)
    is_available = models.BooleanField(default=True)
    
    is_verified = models.BooleanField(default=False)
    verification_documents = models.FileField(upload_to='verification_docs/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} - {self.get_user_type_display()}"

class DonorHealthInfo(models.Model):
    donor = models.OneToOneField(User, on_delete=models.CASCADE, related_name='health_info')
    height = models.FloatField(help_text="Height in cm")
    weight = models.FloatField(help_text="Weight in kg")
    blood_pressure = models.CharField(max_length=20, blank=True)
    hemoglobin_level = models.FloatField(help_text="Hemoglobin level in g/dL")
    diseases = models.TextField(blank=True, help_text="Any existing diseases")
    medications = models.TextField(blank=True, help_text="Current medications")
    last_checkup_date = models.DateField()
    is_smoker = models.BooleanField(default=False)
    is_alcoholic = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Donor Health Information"
        verbose_name_plural = "Donor Health Information"