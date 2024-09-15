from django.shortcuts import render
from .models import User, FriendShip, BlockedFriend
from .serializers import UserSerialiser, FriendshipSerializer, BlockedFriendSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerialiser

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            users = User.objects.filter(name__icontains=query)
            serializer = self.get_serializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'No search query provided'}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['get'])
    def top_users(self, request):
        top_users = User.objects.order_by('-level', '-wins', '-xp')[:10]
        serializer = UserSerialiser(top_users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def user_friends(self, request, pk=None):
        user = self.get_object()
        friends = FriendShip.objects.filter(user=user)
        serializer = FriendshipSerializer(friends, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def user_blocked_friends(self, request, pk=None):
        user = self.get_object()
        bolcked_friends = BlockedFriend.objects.filter(user=user)
        serializer = BlockedFriendSerializer(bolcked_friends, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_friend(self, request, pk=None):
        user = self.get_object()
        friend_name = request.data.get('name')
        try:
            friend = User.objects.get(name=friend_name)
            if FriendShip.objects.filter(user=user, friend=friend).exists():
                return Response({'status': 'friend already added'}, status=status.HTTP_400_BAD_REQUEST)
            FriendShip.objects.create(user=user, friend=friend)
            return Response({'status': 'friend added'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'Friend not found'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def block_friend(self, request, pk=None):
        user = self.get_object()
        friend_name = request.data.get('name')
        try:
            blocked_friend = User.objects.get(name=friend_name)
            friendship = FriendShip.objects.filter(user=user, friend=blocked_friend)
            if friendship.exists():
                friendship.delete()

            if BlockedFriend.objects.filter(user=user, blocked_friend=blocked_friend).exists():
                return Response({'status': 'firend already blocked'}, status=status.HTTP_400_BAD_REQUEST)
            BlockedFriend.objects.create(user=user, blocked_friend=blocked_friend)
            return Response({'status': 'friend blocked'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'Friend not found'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def unblock_user(self, request, pk=None):
        user = self.get_object()
        blocked_user_id = request.data.get('blocked_user_id')
        try:
            blocked_friend = User.objects.get(id=blocked_user_id)
            BlockedFriend.objects.filter(user=user, blocked_friend=blocked_friend).delete()
            return Response({'status': 'friend unblocked'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Friend not found'}, status=status.HTTP_400_BAD_REQUEST)

    
    @action(detail=True, methods=['post'])
    def kickout_friend(self, request, pk=None):
        friend = self.get_object()
        friend_name = request.data.get('name')
        try:
            friendship = User.objects.get(name=friend_name)
            FriendShip.objects.filter(user=friend, friend=friendship).delete()
            return Response({'status': 'Friend has been kicked out'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Friend not found'})
        
            
  