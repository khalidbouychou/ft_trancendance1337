from django.utils import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_pk>\d+)/$', consumers.ChatConsumers.as_asgi()),
]