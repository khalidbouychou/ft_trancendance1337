 
from rest_framework import serializers

from .models import Player, Friend, PingData, TicData


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'username', 'profile_name', 'avatar', 'email', 'status_network', 'two_factor', 'otp', 'otp_verified', 'blocked_users', 'ping_data']


class FriendSerializer(serializers.ModelSerializer):
    user1 = serializers.SerializerMethodField()
    user2 = serializers.SerializerMethodField()

    class Meta:
        model = Friend
        fields = ['user1', 'user2', 'status']

    def get_user1(self, obj):
        return obj.user1.username

    def get_user2(self, obj):
        return obj.user2.username

class PingDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PingData
        fields = ['wins', 'losses', 'exp_game', 'timestamp']

class TicDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicData
        fields = ['wins', 'losses', 'exp_game', 'timestamp']

# class TwoFASerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Player
#         fields = ['two_factor']