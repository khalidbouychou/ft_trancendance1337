from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import ChatRoom, Message
from login.models import Friend
from .serializers import ChatRoomSerializer, MessageSerializer
from login.serializers import PlayerSerializer, FriendSerializer
from django.db import models

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_chat(request):
    chat_rooms = ChatRoom.objects.filter(
        (models.Q(user1=request.user) | models.Q(user2=request.user))
    ).order_by('modified_at')
    contacts = []
    for room in chat_rooms:
        if room.user1 != request.user:
            contacts.append(PlayerSerializer(room.user1).data)
        else:
            contacts.append(PlayerSerializer(room.user2).data)
    user = PlayerSerializer(request.user).data
    # friends = Friend.objects.filter(
    #     (models.Q(user1=request.user) | models.Q(user2=request.user))
    # )
    # user['friends'] = FriendSerializer(friends, many=True).data
    context = {
        'chat_rooms': ChatRoomSerializer(chat_rooms, many=True).data,
        'user': user,
        'contacts': contacts,
    }
    return Response(context)

