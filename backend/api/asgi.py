"""
ASGI config for api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
from pongame.routing import websocket_urlpatterns as pong_urlpatterns
from chat.routing import websocket_urlpatterns as chat_urlpatterns
from chat.middleware import TokenAuthMiddlewareStack
from notification.routing import websocket_urlpatterns as notif_urlpatterns
from daphne import server
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

application = get_asgi_application()

if __name__ == "__main__":
    server.Server(
        application=application,
        ssl_certfile="certs/certificate.crt",
        ssl_keyfile="certs/private.key",
    ).run()

application = ProtocolTypeRouter({
    'http':get_asgi_application(),
    'websocket':TokenAuthMiddlewareStack(
        URLRouter(
            pong_urlpatterns + chat_urlpatterns + notif_urlpatterns
        )
    )
})