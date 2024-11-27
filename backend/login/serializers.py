 
from rest_framework import serializers
from django.db.models import Q
from .models import Player, Friend, PingData, TicData

from django.contrib.auth import authenticate

class PlayerSerializer(serializers.ModelSerializer):
    blocked_users = serializers.SerializerMethodField()
    friends = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ['id', 'username', 'profile_name', 'avatar','email', 'status_network', 'two_factor', 'otp_verified', 'blocked_users', 'friends', 'ping_data' , 'tic_data' , 'bool_login', 'qrcode_path']

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

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['username', 'password', 'profile_name']
        extra_kwargs = {'password': {'write_only': True,'required': True ,'min_length': 8 , 'max_length': 16},
                        'username': {
                            'required': True,
                            'min_length': 9,
                            'max_length': 15,
                            } , 
                        'profile_name': {'write_only': True ,
                                         'required': True, 'min_length': 9,
                                         'max_length': 15
                                         } }

    def create(self, validated_data):
        user = Player.objects.create_user(
            username=validated_data['username'],
            profile_name=validated_data['profile_name'] 
        )
        user.set_password(validated_data['password'])
        user.save()
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



# class FriendSerializer(serializers.ModelSerializer):
#     user1 = serializers.SerializerMethodField()
#     user2 = serializers.SerializerMethodField()

#     class Meta:
#         model = Friend
#         fields = ['user1', 'user2', 'status']

#     def get_user1(self, obj):
#         return obj.user1.username

#     def get_user2(self, obj):
#         return obj.user2.username


# class TwoFASerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Player
#         fields = ['two_factor']