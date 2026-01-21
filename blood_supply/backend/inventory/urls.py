from django.urls import path
from .views import (
    BloodInventoryView,
    BloodSearchView,
    BloodRequestView,
    FulfillRequestView,
    ExpiryAlertView
)

urlpatterns = [
    path('blood/', BloodInventoryView.as_view(), name='blood-inventory'),
    path('search/', BloodSearchView.as_view(), name='blood-search'),
    path('requests/', BloodRequestView.as_view(), name='blood-requests'),
    path('requests/<int:request_id>/fulfill/', FulfillRequestView.as_view(), name='fulfill-request'),
    path('expiry-alerts/', ExpiryAlertView.as_view(), name='expiry-alerts'),
]