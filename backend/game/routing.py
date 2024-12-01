
from django.urls import path , re_path
from .consumer import GameConsumer

urlpatterns = [
    re_path(r'ws/game/', GameConsumer.as_asgi()),
]