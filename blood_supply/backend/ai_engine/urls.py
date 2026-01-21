from django.urls import path
from .views import (
    AIPredictiveModelListView,
    DemandPredictionView,
    ExpiryPredictionView,
    DonorMatchingView,
    NearestBloodBanksView
)

urlpatterns = [
    path('models/', AIPredictiveModelListView.as_view(), name='ai-models'),
    path('predict-demand/', DemandPredictionView.as_view(), name='predict-demand'),
    path('predict-expiry/', ExpiryPredictionView.as_view(), name='predict-expiry'),
    path('match-donors/', DonorMatchingView.as_view(), name='match-donors'),
    path('nearest-banks/', NearestBloodBanksView.as_view(), name='nearest-banks'),
]