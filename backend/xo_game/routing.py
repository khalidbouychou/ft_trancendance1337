from django.urls import re_path
from .consumers import Game
from .consumers import GameInvite

websocket_urlpatterns = [
        re_path(r'ws/game/$', Game.as_asgi()),
        re_path(r'ws/xo_invite/$', GameInvite.as_asgi()),
]

