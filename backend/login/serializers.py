 
from rest_framework import serializers
from django.db.models import Q
from .models import Player, Friend, PingData, TicData


class PlayerSerializer(serializers.ModelSerializer):
    blocked_users = serializers.SerializerMethodField()
    friends = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ['id', 'username', 'profile_name', 'avatar', 'email', 'status_network', 'two_factor', 'otp', 'otp_verified', 'blocked_users', 'friends', 'ping_data']

    def get_blocked_users(self, obj):
        return [{'profile_name': user.profile_name, 'avatar': user.avatar} for user in obj.blocked_users.all()]
    
    def get_friends(self, obj):
        friends = Friend.objects.filter((Q(user1=obj) | Q(user2=obj)) & Q(status='friends'))
        return [{'profile_name': friend.user1.profile_name if friend.user1 != obj else friend.user2.profile_name,
                 'avatar': friend.user1.avatar if friend.user1 != obj else friend.user2.avatar} for friend in friends]  

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