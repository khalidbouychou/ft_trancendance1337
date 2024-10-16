 
from rest_framework import serializers

from .models import Player


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['username', 'profile_name', 'avatar', 'email', 'wins', 'losses', 'exp_game', 'status_network', 'status_game', 'two_factor', 'otp', 'otp_verified']

# class BlockedFriendSerializer(serializers.ModelSerializer):
#     blocked_friend = PlayerSerializer()
#     class Meta:
#         model = BlockedFriend
#         fields = ['id', 'blocked_friend']

# class FriendshipSerializer(serializers.ModelSerializer):
#     friend = PlayerSerializer()
#     class Meta:
#         model = FriendShip
#         fields = ['id', 'friend']

# class TwoFASerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Player
#         fields = ['two_factor']