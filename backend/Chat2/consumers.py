import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from .models import Message, ChatRoom
from login.models import Player, Friend
from .serializers import MessageSerializer, ChatRoomSerializer
from login.serializers import PlayerSerializer

from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    online = {}
    room_group_name = ''
    async def connect(self):
        print("someone trying to connect")
        if self.scope['user'].is_authenticated:
            await self.accept()
            print("we accpet the connection")
        else:
            await self.close()
            return
        self.user = self.scope['user']
        self.user_id = self.user.id
        ChatConsumer.online[self.user.id] = self.channel_name
        self.notification_group_name = f'user_{self.user_id}_notification'

        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if self.user.id in ChatConsumer.online:
            del ChatConsumer.online[self.user.id]

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            handlers = {
                'MESSAGE': self.handle_message,
                'SEARCH_USERS': self.handle_search_users,
                'TYPING': self.handle_typing,
                'SELECT_USER': self.handle_select_user,
                'MARK_AS_READ': self.handle_mark_as_read,
                'BLOCK_USER': self.handle_block_user,
            }

            handler = handlers.get(message_type)
            if handler:
                await handler(text_data_json)
            else:
                await self.send_error('Invalid message type')
        except json.JSONDecodeError:
            await self.send_error('Invalid JSON format')
        except Exception as e:
            await self.send_error(f'An error occurred: {str(e)}')

    async def handle_mark_as_read(self, data):
        room_id = data.get('room_id')
        await self.mark_messages_as_read(room_id, self.user.id)

    async def handle_message(self, data):
        room_pk = data.get('room_id')
        content = data.get('content')
        profile_name = data.get('profile_name')
        if not content:
            await self.send_error('Message content cannot be empty')
            return
        message = await self.create_message(room_pk, self.user.id, content)
        if message is None:
            await self.send(text_data=json.dumps({'type': 'MESSAGE', 
                            'message': 'You are not allowed to send messages to this user'}))
            return
        sender = await sync_to_async(Player.objects.get)(id=self.user.id)
        room = await sync_to_async(ChatRoom.objects.get)(id=room_pk)
        receiver = await sync_to_async(room.get_other_user)(sender)
        room_group_name = f'chat_room_{room_pk}'
        self.room_group_name = room_group_name
        await self.channel_layer.group_add(
            room_group_name,
            self.channel_name
        )
        if (receiver.id in ChatConsumer.online):
            await self.channel_layer.group_add( 
                room_group_name,
                ChatConsumer.online[receiver.id]
            )
        unique_room = await sync_to_async(ChatRoom.get_or_create_room)(sender, receiver)
        chat_room_data = await self.serialize_chat_room(unique_room)
        chat_room = await sync_to_async( ChatRoom.objects.get)(id=room_pk)
        message_count = await sync_to_async(chat_room.messages.count)()
        if message_count == 1:
            await self.channel_layer.group_send(
                f'user_{receiver.id}_notification',  
                {
                    'type': 'new_room_notification', 
                    'room_data': chat_room_data
                }
            )
        message_data = await self.serialize_message(message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_data
            }
        )
        xdata = {
            'status': 'chat_message',
        }
        group_name = f'user_{receiver.id}_NOTIF'
        await self.channel_layer.group_send(
            group_name,
            {
                'type': 'send_notification', 
                'notification': xdata  
            }
        )

    async def handle_search_users(self, data):
        query = data.get('query')
        users = await self.search_users(query)
        await self.send_json({
            'type': 'USERS_LIST',
            'users': users
        })

    async def handle_typing(self, data):
        room_pk = data.get('room_id')
        sender = await sync_to_async(Player.objects.get)(id=self.user.id)
        room = await sync_to_async(ChatRoom.objects.get)(id=room_pk)
        receiver = await sync_to_async(room.get_other_user)(sender)
        room_group_name = f'chat_room_{room_pk}'
        self.room_group_name = room_group_name
        await self.channel_layer.group_add(
            room_group_name,
            self.channel_name
        )
        if (receiver.id in ChatConsumer.online):
            await self.channel_layer.group_add( 
                room_group_name,
                ChatConsumer.online[receiver.id]
            )
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'message_typing',
                'sender': self.user.id,
                'room_id': self.room_group_name
            }
        )

    async def handle_select_user(self, data):
        profile_name = data.get('profile_name')
        try:
            other_user = await self.get_user_by_profile_name(profile_name)
            
            if not other_user or other_user.id == self.user.id:
                await self.send_error('Invalid user selection')
                return

            chat_room = await self.create_or_get_chat_room(self.user, other_user)
            chat_room_data = await self.serialize_chat_room(chat_room)

            await self.send_json({
                'type': 'USER_SELECTED',
                'status': 'OK',
                'chat_room': chat_room_data
            })
        except Player.DoesNotExist:
            await self.send(text_data=json.dumps({
                'type': 'USER_SELECTED',
                'status': 'ERROR',
                'message': 'User does not exist'
            }))
            
    async def handle_block_user(self, data):
        user_id = data.get('user_id')
        event = data.get('event')
        if event == 'BLOCK':
            await self.block_user(user_id)

            await self.channel_layer.group_send(
                f'user_{user_id}_NOTIF', 
                {
                    'type': 'send_notification',
                    'notification': {
                        'status': 'BLOCK',
                        'user_id': self.user.id
                    }
                }
            )
        elif event == 'UNBLOCK':
            await self.unblock_user(user_id)

            await self.channel_layer.group_send(
                f'user_{user_id}_NOTIF', 
                {
                    'type': 'send_notification',
                    'notification': {
                        'status': 'UNBLOCK',
                        'user_id': self.user.id
                    }
                }
            )
        await self.send_json({
            'type': 'BLOCK_USER',
            'event': event,
            'user_id': user_id
        })

    @database_sync_to_async
    def create_message(self, room_id, sender_id, content):
            room = ChatRoom.objects.get(id=room_id)
            sender = Player.objects.get(id=sender_id)
            receiver = room.get_other_user(sender)

            if Player.are_enemies(sender, receiver):
                return None

            return Message.objects.create(
                chat_room=room,
                sender=sender,
                content=content
            )

    @database_sync_to_async
    def search_users(self, query):
        players = (Player.objects
                  .filter(profile_name__icontains=query)
                  .exclude(id=self.user.id))
        return PlayerSerializer(players, many=True).data

    @database_sync_to_async
    def get_user_by_profile_name(self, profile_name):
        return Player.objects.get(profile_name=profile_name)

    @database_sync_to_async
    def create_or_get_chat_room(self, user1, user2):
        obj = ChatRoom.get_or_create_room(user1, user2)
        return obj

    @database_sync_to_async
    def mark_messages_as_read(self, room_id, user_id):
        room = ChatRoom.objects.get(id=room_id)
        room.mark_messages_read(Player.objects.get(id=user_id))

    @database_sync_to_async
    def serialize_message(self, message):
        return MessageSerializer(message, context={'user': self.user}).data

    @database_sync_to_async
    def serialize_chat_room(self, chat_room):
        return ChatRoomSerializer(
            chat_room,
            context={'user': self.user} 
        ).data

    @database_sync_to_async
    def block_user(self, user_id):
        my_id = self.scope['user'].id
        friend = Friend.objects.filter(Q(user1=user_id, user2=my_id) | Q(user1=my_id, user2=user_id)).first() 
        if friend is not None:
            friend.delete()
        target_user = Player.objects.get(id=user_id)
        self.user.block_user(target_user)

    @database_sync_to_async
    def unblock_user(self, user_id):
        target_user = Player.objects.get(id=user_id)
        self.user.unblock_user(target_user) 

    async def send_error(self, message):
        await self.send_json({
            'type': 'ERROR',
            'message': message
        })
    async def chat_message(self, event):
        await self.send_json({
            'type': 'MESSAGE',
            'message': event['message']
        })

    async def message_typing(self, event):
        await self.send_json({
            'type': 'TYPING',
            'sender': event['sender'],
            'room_id': event['room_id']
        })

    async def send_notification(self, event):
        notification = event['notification']
        await self.send(text_data=json.dumps({
            'notification': notification
        }))

    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))

    async def new_room_notification(self, event):
        room_data = event['room_data']
        print("inside new_room_notification contant:", room_data)
        await self.send(text_data=json.dumps({
            'type': 'NEW_ROOM',
            'room_data': room_data
        }))
        print("we send the new room notification")  