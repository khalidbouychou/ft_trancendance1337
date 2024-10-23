import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
from pongame.routing import websocket_urlpatterns as pong_urlpatterns
from chat.routing import websocket_urlpatterns as chat_urlpatterns
from chat.middleware import TokenAuthMiddlewareStack
from notification.routing import websocket_urlpatterns as notif_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

application = ProtocolTypeRouter({
    'http':get_asgi_application(),
    'websocket':TokenAuthMiddlewareStack(
        URLRouter(
            pong_urlpatterns + chat_urlpatterns + notif_urlpatterns
        )
    )
})