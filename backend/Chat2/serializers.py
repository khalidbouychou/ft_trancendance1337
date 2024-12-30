from rest_framework import serializers
from .models import ChatRoom, Message
from login.serializers import PlayerSerializer

class MessageSerializer(serializers.ModelSerializer):
    receiver = serializers.SerializerMethodField()
    sender = PlayerSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'receiver', 'sender', 'content', 'created_at', 'is_read']
        read_only_fields = ['id', 'created_at']

    def get_receiver(self, obj):
        return PlayerSerializer(obj.receiver).data

class ChatRoomSerializer(serializers.ModelSerializer):
    user1 = PlayerSerializer(read_only=True)
    user2 = PlayerSerializer(read_only=True)
    messages = serializers.SerializerMethodField()
    last_message = MessageSerializer(read_only=True)
    
    class Meta:
        model = ChatRoom
        fields = ['id', 'user1', 'user2', 'created_at', 'modified_at', 'messages', 'last_message']
        read_only_fields = ['id', 'created_at', 'modified_at']

    def get_messages(self, obj):
        messages = obj.messages.all()
        return MessageSerializer(messages, many=True).data
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        user = self.context.get('user')
        # If context includes the current user, ensure other_user is always user2
        if user:
            if user.id == data['user1']['id']:
                data['user1'], data['user2'] = data['user2'], data['user1']
        
        return data