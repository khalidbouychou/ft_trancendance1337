 
from rest_framework import serializers
from django.db.models import Q
from .models import *

from django.contrib.auth.hashers import make_password


class PlayerSerializer(serializers.ModelSerializer):
    blocked_users = serializers.SerializerMethodField()
    friends = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ['id', 'username', 'profile_name', 'avatar','email', 'status_network', 'two_factor', 'otp_verified', 'blocked_users', 'friends', 'ping_data' , 'tic_data' , 'bool_login', 'qrcode_path','is_anonimized']

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

class TicDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicData
        fields = ['wins', 'losses', 'exp_game', 'timestamp']
        # fields = ['username', 'profile_name','avatar' ,'status_network', 'status_game', 'two_factor', 'otp_verified', 'qrcode_path','bool_login']

def myownvalidate(data):
    username = data.get('username')
    profile_name = data.get('profile_name')
    password = data.get('password')
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
        TicData.objects.create(player=user)
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

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        # Check if the user exists
        user = Player.objects.filter(username=username).first()
        if user is None:
            raise serializers.ValidationError({'error': 'User Not Found'})

        # Authenticate the user
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError({'error': 'Wrong Password'})
        else:
            raise serializers.ValidationError({'error': "Username and Password are required"})

        # If authentication is successful, return the validated data
        return data



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

class AnonymizedAccountSerializer(serializers.ModelSerializer):
    player =serializers.CharField(read_only=True)
    # data = 
    class Meta:
        model = AnonymizedAccount
        fields = ['player', 'profile_name', 'avatar','status_network']
# class TwoFASerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Player
#         fields = ['two_factor']