 
import re
from rest_framework import serializers
from django.db.models import Q
from .models import *

from django.contrib.auth.hashers import make_password


class PlayerSerializer(serializers.ModelSerializer):
    blocked_users = serializers.SerializerMethodField()
    friends = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ['id', 'username', 'profile_name', 'avatar', 'status_network', 'two_factor', 'otp_verified', 'blocked_users', 'friends', 'ping_data' , 'number_of_sessions', 'bool_login', 'qrcode_path','is_anonimized']

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
    player_username = serializers.CharField(source='player.username', read_only=True)
    class Meta:
        model = PingData
        fields = ['wins', 'losses', 'exp_game', 'timestamp', 'player_username'] 

def myownvalidate(data):
    username = data.get('username')
    profile_name = data.get('profile_name') 
    password = data.get('password')
    username = username.strip()
    profile_name = profile_name.strip()
    if not username.isalnum():
        raise serializers.ValidationError({'error': 'Username can only contain alphanumeric characters'})
    if not profile_name.isalnum():
        raise serializers.ValidationError({'error': 'Profile name can only contain alphanumeric characters'})
    if not password.isalnum():
        raise serializers.ValidationError({'error': 'Password can only contain alphanumeric characters'})
    
    user = Player.objects.filter(Q(username=username) | Q(profile_name=profile_name))
    if user:
       raise serializers.ValidationError({'error': 'Username or profile name already exists'})
    # Check for special characters and spaces
    if not username or not profile_name or not password:
        raise serializers.ValidationError({'error': 'All fields are required'})
    if len(username) < 9 or len(username) > 15:
        raise serializers.ValidationError({'error': 'Username must be between 9 and 15 characters'})
    if len(profile_name) < 9 or len(profile_name) > 15:
        raise serializers.ValidationError({'error': 'Profile name must be between 9 and 15 characters'}) 
    if len(password) < 8 or len(password) > 16:
        raise serializers.ValidationError({'error': 'Password must be between 8 and 16 characters'}) 
    return data
class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['username', 'password', 'profile_name']
        extra_kwargs = {'password': {'write_only': True,'required': True},
                        'username': {'required': True,} , 'profile_name': {'write_only': True ,'required': True,} }

    def create(self, validated_data):
        validdata = myownvalidate(validated_data)
        user = Player.objects.create_user(
            username=validdata['username'],
            profile_name=validdata['profile_name'], 
        )
        user.set_password(validated_data['password'])
        user.save()
        PingData.objects.create(player=user)
        return user
    


class SigninSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['username', 'password']
        # fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True, 'required': True, 'min_length': 8, 'max_length': 16},
            'username': {'required': True, 'min_length': 9, 'max_length': 16}
        }


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
