from rest_framework import serializers
from .models import User, FriendShip,BlockedFriend

class UserSerialiser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'login', 'level', 'ratio', 'match_total', 'wins', 'losses', 'percentage', 'image', 'xp', 'online']

class BlockedFriendSerializer(serializers.ModelSerializer):
    blocked_friend = UserSerialiser()
    class Meta:
        model = BlockedFriend
        fields = ['id', 'blocked_friend']

class FriendshipSerializer(serializers.ModelSerializer):
    friend = UserSerialiser()
    class Meta:
        model = FriendShip
        fields = ['id', 'friend']
