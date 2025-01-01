from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Notification
from django.db import DatabaseError
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from login.models import Player
from rest_framework.decorators import permission_classes , authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from login.models import Player
from asgiref.sync import sync_to_async
import asyncio

class NotificationConsumer(AsyncWebsocketConsumer):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    time = 0
    async def connect(self):
        self.user = self.scope['user']
        self.user_id = self.user.id
        self.notification_group_name = f'user_{self.user_id}_NOTIF'

        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.notification_group_name,
            self.channel_name
        )
        user = self.scope['user']
        user.status_network = 'offline'
        await sync_to_async(user.save)()
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        game_type = text_data_json.get('game_type')

        # try:
        if message_type == 'CANCEL_FR':
            await self.cancel_FR(text_data_json)
        elif message_type == 'ACCEPT_FR':
            await self.accept_FR(text_data_json)
        elif message_type == 'DECLINE_FR':
            await self.decline_FR(text_data_json)
        elif message_type == 'SEND_FR':
            await self.send_FR(text_data_json)
        elif message_type == 'CANCEL_GR':
            await self.cancel_GR(text_data_json, game_type)
        elif message_type == 'ACCEPT_GR':
            await self.accept_GR(text_data_json, game_type)
        elif message_type == 'DECLINE_GR':
            await self.decline_GR(text_data_json, game_type)
        elif message_type == 'SEND_GR':
            await self.send_GR(text_data_json, game_type)
        elif message_type == 'CONNECTED':
            self.time = 10
            user = self.scope['user']
            user.status_network = 'online'
            await sync_to_async(user.save)()

    @database_sync_to_async
    def cancel_FR(self, event):
        from_user_id = self.scope['user'].id
        to_user_id = event['to_user_id']
        notifications = Notification.objects.filter(
            from_user_id=from_user_id, 
            to_user_id=to_user_id, 
            notif_type='FR', 
            status='pending'
        )
        for notification in notifications:
            notification.status = 'cancelled'
            notification.save()
    
    @database_sync_to_async
    def accept_FR(self, text_data_json):
        from_user_id = text_data_json['from_user_id']
        to_user_id = self.scope['user'].id
        notifications = Notification.objects.filter(
            from_user_id=from_user_id, 
            to_user_id=to_user_id, 
            notif_type='FR', 
            status='pending'
        )
        for notification in notifications:
            notification.status = 'accepted'
            notification.save()
    
    @database_sync_to_async
    def decline_FR(self, text_data_json):
        from_user_id = text_data_json['from_user_id']
        to_user_id = self.scope['user'].id
        notifications = Notification.objects.filter(
            from_user_id=from_user_id, 
            to_user_id=to_user_id, 
            notif_type='FR', 
            status='pending'
        )
        for notification in notifications:
            notification.status = 'declined'
            notification.save()

    @database_sync_to_async
    def send_FR(self, text_data_json):
        from_user_id = self.scope['user'].id
        to_user_id = text_data_json['to_user_id']
        notif = Notification.objects.get_or_create(
            from_user_id=from_user_id,
            to_user_id=to_user_id,
            notif_type='FR',
            status='pending'
        )

    @database_sync_to_async
    def cancel_GR(self, text_data_json, game_type):
        from_user_id = self.scope['user'].id
        to_user_id = text_data_json['to_user_id']
        notifications = Notification.objects.filter(
            from_user_id=from_user_id, 
            to_user_id=to_user_id, 
            notif_type='GR', 
            game_type=game_type, 
            status='pending'
        )
        for notification in notifications:
            notification.status = 'cancelled'
            notification.save()

    @database_sync_to_async
    def accept_GR(self, text_data_json, game_type):
        from_user_id = text_data_json['from_user_id']
        to_user_id = self.scope['user'].id
        notifications = Notification.objects.filter(
            from_user_id=from_user_id, 
            to_user_id=to_user_id, 
            notif_type='GR', 
            game_type=game_type, 
            status='pending'
        )
        for notification in notifications:
            notification.status = 'accepted'
            notification.save()

    @database_sync_to_async
    def decline_GR(self, text_data_json, game_type):
        from_user_id = text_data_json['from_user_id']
        to_user_id = self.scope['user'].id
        notifications = Notification.objects.filter(
            from_user_id=from_user_id, 
            to_user_id=to_user_id, 
            notif_type='GR', 
            game_type=game_type, 
            status='pending'
        )
        for notification in notifications:
            notification.status = 'declined'
            notification.save()

    @database_sync_to_async
    def send_GR(self, text_data_json, game_type):
        from_user_id = self.scope['user'].id
        to_user_id = text_data_json['to_user_id']
        game_room = text_data_json.get('game_room', '')
        notifs = Notification.objects.filter(
            from_user_id=from_user_id, 
            to_user_id=to_user_id, 
            notif_type='GR', 
            game_type=game_type, 
            game_room=game_room,
            status='pending'
        )
        for notif in notifs:
            if notif and notif.is_expired():
                notifs.update(status='expired')
                break
        Notification.objects.get_or_create(
            from_user_id=from_user_id,
            to_user_id=to_user_id,
            notif_type='GR',
            game_room=game_room,
            game_type=game_type,
            status='pending'
        )
    
    async def send_notification(self, event):
        notification = event['notification']
        print(f'Sending notification {notification.get("status")}')
        await self.send(text_data=json.dumps({
            'type': f'NOTIFICATION_{notification.get("status").upper()}',
            'notification': notification
        }))
    
    async def failed_operation(self, operation, error):
        await self.send(text_data=json.dumps({
            'type': 'FAILED_OPERATION',
            'operation': operation,
            'error': str(error)
        }))

