from rest_framework import serializers
from .models import ChatRoom, Message
from .serializers import PlayerSerializer


class ChatRoomSerializer(serializers.ModelSerializer):
    user1 = PlayerSerializer()
    user2 = PlayerSerializer()

    class Meta:
        model = ChatRoom
        fields = ['id', 'user1', 'user2', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    sender = PlayerSerializer()

    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'sender', 'content', 'is_read', 'timestamp']
