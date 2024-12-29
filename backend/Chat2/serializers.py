from rest_framework import serializers
from .models import ChatRoom, Message
from login.serializers import PlayerSerializer


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'user1', 'user2', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'sender', 'content', 'is_read', 'timestamp']
