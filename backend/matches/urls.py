from django.urls import path
from .views import get_matches, get_matches_by_username

urlpatterns = [
    path('matches/', get_matches, name='get_matches'),
    path('matches/<str:username>/', get_matches_by_username, name='get_matches_by_username'),
]
