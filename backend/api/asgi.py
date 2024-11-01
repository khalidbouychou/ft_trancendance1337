import os
from django.core.asgi import get_asgi_application

"""
ASGI config for api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

application = get_asgi_application()


# asgi.py

# import os
# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from your_app_name import routing  # Import your routing

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')

# application = ProtocolTypeRouter({
#     "http": get_asgi_application(),
#     "websocket": AuthMiddlewareStack(
#         URLRouter(
#             routing.websocket_urlpatterns  # Define your WebSocket URL patterns here
#         )
#     ),
# })
