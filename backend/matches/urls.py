from django.urls import path
from .views import get_matches, get_matches_by_profile_name

urlpatterns = [
    path('matches/', get_matches, name='get_matches'),
    path('matches/<str:profile_name>/', get_matches_by_profile_name, name='get_matches_by_username'),
]
