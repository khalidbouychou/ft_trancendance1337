 
from rest_framework import serializers

from .models import Player, Friend


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = [ 'username', 'avatar' ,'profile_name', 'oldtoken']


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


# class TwoFASerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Player
#         fields = ['two_factor']