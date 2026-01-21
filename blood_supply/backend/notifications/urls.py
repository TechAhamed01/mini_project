from django.urls import path
from .views import (
    NotificationListView,
    NotificationDetailView,
    MarkAllAsReadView,
    NotificationStatsView
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('mark-all-read/', MarkAllAsReadView.as_view(), name='mark-all-read'),
    path('stats/', NotificationStatsView.as_view(), name='notification-stats'),
]