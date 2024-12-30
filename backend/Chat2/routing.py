from django.urls import path
from . import consumers
 
websocket_urlpatterns = [
    path('ws/chat/<int:room_pk>/', consumers.ChatConsumer.as_asgi()),
    path('ws/notification/', consumers.UserNotificationConsumer.as_asgi()),
]