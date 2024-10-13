from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Notification
from django.db import DatabaseError
from channels.db import database_sync_to_async

# class NotificationRouterConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.user_id = self.scope['user'].id
#         if self.user_id is None:
#             await self.close()
#             return

#         self.fr_consumer = FriendRequestConsumer()
#         self.gr_consumer = GameRequestConsumer()

#         self.fr_consumer.scope = self.scope
#         self.gr_consumer.scope = self.scope
#         self.fr_consumer.channel_layer = self.channel_layer
#         self.gr_consumer.channel_layer = self.channel_layer
#         self.fr_consumer.channel_name = self.channel_name
#         self.gr_consumer.channel_name = self.channel_name

#         await self.fr_consumer.connect()
#         await self.gr_consumer.connect()

#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.fr_consumer.disconnect(close_code)
#         await self.gr_consumer.disconnect(close_code)

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         message_type = text_data_json.get('type')

#         if message_type.endswith('_FR'):
#             await self.fr_consumer.receive(text_data)
#         elif message_type.endswith('_GR'):
#             await self.gr_consumer.receive(text_data)
#         else:
#             await self.send(text_data=json.dumps({
#                 'type': 'error',
#                 'message': 'Unknown message type'
#             }))

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['user']
        if self.user_id is None:
            await self.close()
            return
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
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        try:
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
        except DatabaseError as e:
            await self.failed_operation(message_type, e)

    @database_sync_to_async
    def cancel_FR(self, event):
        from_user_id = self.scope['user'].id
        to_user_id = event['to_user_id']
        notifications = Notification.objects.filter(
            from_user__id=from_user_id, 
            to_user__id=to_user_id, 
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
            from_user__id=from_user_id, 
            to_user__id=to_user_id, 
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
            from_user__id=from_user_id, 
            to_user__id=to_user_id, 
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
        Notification.objects.get_or_create(
            from_user__id=from_user_id,
            to_user__id=to_user_id,
            notif_type='FR',
            status='pending',
        )

    async def send_FR_notification(self, event):
        FR_notification = event['FR_notification']

        await self.send(text_data=json.dumps({
            'type': 'NEW_NOTIFICATION',
            'FR_notification': FR_notification
        }))

    @database_sync_to_async
    def cancel_GR(self, text_data_json, game_type):
        from_user_id = self.scope['user'].id
        to_user_id = text_data_json['to_user_id']
        notifications = Notification.objects.filter(
            from_user__id=from_user_id, 
            to_user__id=to_user_id, 
            notif_type='GR', 
            game_type=game_type, 
            status='pending'
        )
        for notification in notifications:
            notification.status = 'cancelled'
            notification.save()

    @database_sync_to_async
    def accept_GR(self, text_data_json, game_type):
        from_user_id = self.scope['user'].id
        to_user_id = text_data_json['to_user_id']
        notifications = Notification.objects.filter(
            from_user__id=from_user_id, 
            to_user__id=to_user_id, 
            notif_type='GR', 
            game_type=game_type, 
            status='pending'
        )
        for notification in notifications:
            notification.status = 'accepted'
            notification.save()

    @database_sync_to_async
    def decline_GR(self, text_data_json, game_type):
        from_user_id = self.scope['user'].id
        to_user_id = text_data_json['to_user_id']
        notifications = Notification.objects.filter(
            from_user__id=from_user_id, 
            to_user__id=to_user_id, 
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
        Notification.objects.get_or_create(
            from_user__id=from_user_id,
            to_user__id=to_user_id,
            notif_type='GR',
            game_type=game_type,
            status='pending'
        )
    
    async def send_GR_notification(self, event):
        GR_notification = event['GR_notification']

        await self.send(text_data=json.dumps({
            'type': 'NEW_NOTIFICATION',
            'GR_notification': GR_notification
        }))
    
    async def send_GR_accepted_notification(self, event):
        GR_accepted_notification = event['GR_accepted_notification']

        await self.send(text_data=json.dumps({
            'type': 'NOTIFICATION_ACCEPTED',
            'GR_accepted_notification': GR_accepted_notification
        }))

    async def send_GR_expired_notification(self, event):
        GR_expired_notification = event['GR_expired_notification']

        await self.send(text_data=json.dumps({
            'type': 'NOTIFICATION_EXPIRED',
            'GR_expired_notification': GR_expired_notification
        }))
    
    async def failed_operation(self, operation, error):
        await self.send(text_data=json.dumps({
            'type': 'FAILED_OPERATION',
            'operation': operation,
            'error': str(error)
        }))

