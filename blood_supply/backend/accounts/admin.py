

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, DonorHealthInfo

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'city', 'is_verified', 'is_staff')
    list_filter = ('user_type', 'is_verified', 'is_staff', 'city')
    search_fields = ('username', 'email', 'phone', 'hospital_name', 'blood_bank_name')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email', 'phone')}),
        ('Location', {'fields': ('address', 'city', 'state', 'country', 'pincode', 'latitude', 'longitude')}),
        ('User Type Specific', {'fields': (
            'user_type', 'hospital_name', 'has_blood_bank', 'license_number',
            'blood_bank_name', 'blood_bank_license', 'blood_group', 'date_of_birth'
        )}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'last_donation_date')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'user_type'),
        }),
    )

@admin.register(DonorHealthInfo)
class DonorHealthInfoAdmin(admin.ModelAdmin):
    list_display = ('donor', 'height', 'weight', 'hemoglobin_level', 'last_checkup_date')
    list_filter = ('is_smoker', 'is_alcoholic')
    search_fields = ('donor__username', 'donor__email')

admin.site.register(User, CustomUserAdmin)