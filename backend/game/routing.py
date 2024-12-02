
from django.urls import path , re_path
from .consumer import GameConsumer

urlpatterns = [
    re_path(r'ws/game/remote', GameConsumer.as_asgi()),
]