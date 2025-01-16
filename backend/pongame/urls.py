from django.urls import path
from .views import *

urlpatterns = [
    path('game-state/<str:room_name>/', game_state_view, name='game_state_view'),
    path('pong_data/', UserDataView.as_view(), name="pong_data"),  
]