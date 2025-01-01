



from django.urls import re_path
from .consumer import  UserConsumer

websocket_urlpatterns = [
    re_path(r'ws/network_status/$', UserConsumer.as_asgi())
]