 
from rest_framework import serializers

from .models import Player
from django.contrib.auth.hashers import make_password


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['username', 'profile_name','avatar' ,'status_network', 'status_game', 'two_factor', 'otp_verified', 'qrcode_path','bool_login']
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
        # fields = ['username', 'password']
        fields = '__all__'
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