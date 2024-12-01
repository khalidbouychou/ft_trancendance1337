



from django.urls import path
from .views import Game_remote
urlpatterns = [
    
    path('game_remote' , Game_remote.as_view() , name='game_remote'),
]
