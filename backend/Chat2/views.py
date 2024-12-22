from django.db import models
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, PlayerSerializer


class ChatRoomsView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        chat_rooms = ChatRoom.objects.filter(
            models.Q(user1=user) | models.Q(user2=user)
        ).order_by('-created_at')

        contacts = []
        for chat_room in chat_rooms:
            other_user = chat_room.user1 if chat_room.user2 == user else chat_room.user2
            contacts.append(PlayerSerializer(other_user).data)

        serialized_chat_rooms = ChatRoomSerializer(chat_rooms, many=True).data
        serialized_user = PlayerSerializer(user).data

        context = {
            'user': serialized_user,
            'chat_rooms': serialized_chat_rooms,
            'contacts': contacts,
        }

        return Response(context)
