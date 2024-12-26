import json
import sys
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from .models import ChatRoom, Message, Player
from .serializers import MessageSerializer, PlayerSerializer, ChatRoomSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication


class ChatConsumers(AsyncWebsocketConsumer):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    async def connect(self):
        # Extract room_pk from URL
        self.room_name = self.scope['url_route']['kwargs']['room_pk']
        self.room_group_name = f'chat_room_{self.room_name}'
        self.user = self.scope['user']

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')
        print("message_type:", message_type)
        try:
            # profile_name = text_data_json.get('profile_name')
            # print("Profile_name: ", profile_name)
            if message_type == 'MESSAGE':
                await self.handle_message(text_data_json)
            elif message_type == 'SEARCH_USERS':
                await self.handle_search_users(text_data_json)
            elif message_type == 'TYPING':
                await self.handle_typing(text_data_json)
            elif message_type == 'SELECT_USER':
                await self.handle_select_user(text_data_json)
            elif message_type == 'MARK_AS_READ':
                await self.handle_mark_as_read(text_data_json)
            elif message_type == 'BLOCK_USER':
                await self.handle_block_user(text_data_json)
            else:
                await self.send_error_response(f"Unknown message type: {message_type}")
        except ObjectDoesNotExist as e:
            print(f"Error: {e}", file=sys.stderr)
 
    # Message type handlers

    async def handle_message(self, data):
        room_pk = data.get('room_id')
        sender_id = data.get('sender')
        content = data.get('content')

        message = await sync_to_async(self.create_message)(room_pk, sender_id, content)
        if not message:
            await self.send_error_response("You are not allowed to send messages to this user.")
            return

        message_data = await sync_to_async(MessageSerializer(message).data)
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'chat_message',
            'message': message_data
        })

    async def handle_search_users(self, data):
        query = data.get('query')
        print("query", query)
        users = await sync_to_async(self.get_users)(query)
        print("--users--: ", users)
        await self.send(text_data=json.dumps({'type': 'USERS_LIST', 'users': users}))

    async def handle_typing(self, data):
        sender = data.get('sender')
        room_pk = data.get('room_id')
        await self.channel_layer.group_send(self.room_group_name, {
            'type': 'typing_notification',
            'sender': sender,
            'room_id': room_pk
        })

    async def handle_select_user(self, data): 
        profile_name = data.get('profile_name')
        print("im at handle_select_user with", profile_name)
        try:
            user1 = await sync_to_async(Player.objects.get)(profile_name=profile_name)
            user2 = self.scope['user']

            if user1 == user2:
                await self.send_error_response("Cannot select yourself.")
                return

            chat_room = await sync_to_async(self.get_or_create_chat_room)(user1, user2)
            chat_room_serializer = ChatRoomSerializer(chat_room)
            chat_room_data = await sync_to_async(chat_room_serializer.data)
            await self.send(text_data=json.dumps({'type': 'USER_SELECTED', 'chat_room': chat_room_data}))
        except ObjectDoesNotExist:
            await self.send_error_response("User not found.")

    async def handle_mark_as_read(self, data):
        room_id = data.get('room_id')
        user_id = data.get('user')
        await sync_to_async(self.mark_messages_as_read)(room_id, user_id)

    async def handle_block_user(self, data):
        user_to_block_id = data.get('user_id')
        event = data.get('event')

        if event == 'BLOCK':
            await sync_to_async(self.block_user)(user_to_block_id)
        elif event == 'UNBLOCK':
            await sync_to_async(self.unblock_user)(user_to_block_id)

        await self.send(text_data=json.dumps({'type': 'BLOCK_USER', 'event': event, 'user_id': user_to_block_id}))

    # Helper methods

    def create_message(self, room_pk, sender_id, content):
        try:
            chat_room = ChatRoom.objects.get(pk=room_pk)
            sender = Player.objects.get(pk=sender_id)
            receiver = chat_room.user1 if chat_room.user2 == sender else chat_room.user2

            if Player.are_enemies(sender, receiver):
                return None

            return Message.objects.create(chat_room=chat_room, sender=sender, content=content)
        except ObjectDoesNotExist:
            return None

    def get_users(self, query):
        players = Player.objects.filter(profile_name__icontains=query).exclude(id=self.scope['user'].id)
        return PlayerSerializer(players, many=True).data

    # def get_or_create_chat_room(self, user1, user2):
    #     chat_room, _ = ChatRoom.objects.get_or_create(
    #         Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1),
    #         defaults={'user1': user1, 'user2': user2}
    #     )
    #     return chat_room

    def get_or_create_chat_room(self, user1, user2):
        # Define the query filters
        filters = Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1)
        
        # Use `get_or_create` properly
        try:
            chat_room, created = ChatRoom.objects.get_or_create(
                filters,
                defaults={'user1': user1, 'user2': user2}
            )
        except TypeError:
            # Explicitly filter before calling `get_or_create` due to `filters`
            chat_room = ChatRoom.objects.filter(filters).first()
            if not chat_room:
                chat_room = ChatRoom.objects.create(user1=user1, user2=user2)
            created = True
        
        return chat_room

    def mark_messages_as_read(self, room_id, user_id):
        chat_room = ChatRoom.objects.get(pk=room_id)
        user = Player.objects.get(pk=user_id)
        chat_room.messages.exclude(sender=user).update(is_read=True)

    def block_user(self, user_to_block_id):
        current_user = self.scope['user']
        user_to_block = Player.objects.get(pk=user_to_block_id)
        current_user.block_user(user_to_block)

    def unblock_user(self, user_to_unblock_id):
        current_user = self.scope['user']
        user_to_unblock = Player.objects.get(pk=user_to_unblock_id)
        current_user.unblock_user(user_to_unblock)

    # Error handling and utility methods

    async def send_error_response(self, message):
        await self.send(text_data=json.dumps({'type': 'ERROR', 'message': message}))

    # Group send handlers

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({'type': 'MESSAGE', 'message': event['message']}))

    async def typing_notification(self, event):
        await self.send(text_data=json.dumps({'type': 'TYPING', 'sender': event['sender'], 'room_id': event['room_id']}))

class UserNotificationConsumer(AsyncWebsocketConsumer):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    async def connect(self): 
        self.user = self.scope['user']
        self.user_id = self.user.id
        self.notification_group_name = f'user_{self.user_id}_notification'

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
        pass

    async def new_room_notification(self, event):
        room_data = event['room_data']

        await self.send(text_data=json.dumps({
            'type': 'NEW_ROOM',
            'room_data': room_data
        }))
    
