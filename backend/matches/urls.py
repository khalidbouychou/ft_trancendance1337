from django.urls import path
from .views import *

urlpatterns = [
    path('matches/', get_matches, name='get_matches'),
    path('matches/<str:username>/', get_matches_by_profile_name, name='get_matches_by_profile_name'),
]
