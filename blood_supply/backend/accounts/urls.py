from django.urls import path
from .views import (
    RegisterView, LoginView, ProfileView,
    DashboardView, DonorHealthInfoView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('health-info/', DonorHealthInfoView.as_view(), name='health-info'),
]