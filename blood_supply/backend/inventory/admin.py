from django.contrib import admin
from .models import BloodType, BloodRequest

@admin.register(BloodType)
class BloodTypeAdmin(admin.ModelAdmin):
    list_display = ('blood_group', 'component_type', 'quantity', 'blood_bank', 
                    'expiry_date', 'status', 'is_expiring_soon', 'days_until_expiry')
    list_filter = ('blood_group', 'component_type', 'status', 'expiry_date', 'blood_bank__city')
    search_fields = ('batch_number', 'blood_bank__username', 'blood_bank__blood_bank_name')
    readonly_fields = ('days_until_expiry',)
    actions = ['mark_as_tested']
    
    def mark_as_tested(self, request, queryset):
        queryset.update(is_tested=True, status='AVAILABLE')
        self.message_user(request, f"{queryset.count()} blood units marked as tested.")
    mark_as_tested.short_description = "Mark selected as tested"

@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'hospital', 'blood_group', 'component_type', 
                    'quantity_required', 'urgency', 'status', 'created_at')
    list_filter = ('status', 'urgency', 'blood_group', 'hospital__city')
    search_fields = ('hospital__username', 'hospital__hospital_name', 'patient_details')
    readonly_fields = ('created_at', 'updated_at', 'fulfilled_at')
    actions = ['approve_requests', 'reject_requests']
    
    def approve_requests(self, request, queryset):
        queryset.update(status='APPROVED')
        self.message_user(request, f"{queryset.count()} requests approved.")
    approve_requests.short_description = "Approve selected requests"
    
    def reject_requests(self, request, queryset):
        queryset.update(status='REJECTED')
        self.message_user(request, f"{queryset.count()} requests rejected.")
    reject_requests.short_description = "Reject selected requests"