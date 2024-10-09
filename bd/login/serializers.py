 
from rest_framework import serializers

from .models import Player


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['username', 'avatar', 'email', 'is_logged', 'wins', 'losses', 'level', 'exp_game', 'status_network', 'status_game', 'two_factor', 'otp', 'otp_verified' , 'profile_name']

# class TwoFASerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Player
#         fields = ['two_factor']