from django.urls import path
from .views import game_state_view, game_xp
   
urlpatterns = [
    path('game-state/<str:room_name>/', game_state_view, name="game_state"),
    path('game_xp/', game_xp, name="game_xp"),
]  