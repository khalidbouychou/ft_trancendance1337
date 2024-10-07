
from rest_framework.response import Response
import requests
from django.contrib.auth.models import User
from .serializers import PlayerSerializer
from .models import Player as Player
from rest_framework import viewsets, status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken , UntypedToken
from rest_framework_simplejwt.exceptions import TokenError

import os

C_ID = os.getenv('C_ID')
SCID = os.getenv('SCID')
REDIRECT_URI = os.getenv('REDIRECT_URI')


def search_user(username):
    try:
        user = User.objects.get(username=username)
        return user
    except User.DoesNotExist:
        return None


def check_user_if_exist(login):
    if User.objects.filter(username=login).exists():
        return True
    return False


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def generate_qr_code(self, request):
        token = request.COOKIES.get('access')
        if not token:
            return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = AccessToken(token).user
            if user.two_factor:
                return Response({'error': '2FA already enabled'}, status=status.HTTP_400_BAD_REQUEST)
            user.two_factor = True
            user.save()
            return Response({'msg': '2FA enabled'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def create_user(self, user_data):
        user = Player(
            username=user_data['username'],
            avatar=user_data['avatar'],
            email=user_data['email'],
            is_logged=True,
            wins=0,
            losses=0,
            level=1,
            exp_game=0,
            status_network='online',
            status_game='offline',
            two_factor=False,
            otp='000000',
            otp_verified=False,
            profile_name = user_data['username'],
        )
        user.set_unusable_password()  # Assuming password is not used
        user.save()
        return user

    def auth_intra(self, request):
        try:
            response = Response(
                {'url': f'https://api.intra.42.fr/oauth/authorize?client_id={C_ID}&redirect_uri={REDIRECT_URI}&response_type=code'}, status=status.HTTP_200_OK)
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def create_jwt_token(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def login(self, request):
        try:
            # Exchange authorization code for access token
            response = requests.post(
                'https://api.intra.42.fr/oauth/token/',
                data={
                    'grant_type': 'authorization_code',
                    'client_id': C_ID,
                    'client_secret': SCID,
                    'code': request.data.get('code'),
                    'redirect_uri': REDIRECT_URI
                }
            )
            response.raise_for_status()
            token = response.json().get('access_token')
            if not token:
                return Response({'error': 'Intra Token not provided'}, status=status.HTTP_400_BAD_REQUEST)

            headers = {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
            response = requests.get(
                'https://api.intra.42.fr/v2/me', headers=headers)
            response.raise_for_status()  # Check if the request was successful
            intra_data = response.json()

            user_data = {
                'username': intra_data.get('login'),
                'avatar': intra_data.get('image')['link'],
                'email': intra_data.get('email'),
            }
            user = Player.objects.filter(
                username=user_data['username']).first()
            if not user:
                user = self.create_user(user_data)
            tokens = self.create_jwt_token(user)
            user_data = {
                'username': user.username,
                'profile_name': user.profile_name,
                'avatar': user.avatar,
                'email': user.email,
                'two_factor': user.two_factor,
                'is_logged': user.is_logged,
                'status': 'success'
            }
            print('user_data ---- >', user_data.get('is_logged'))
            response = Response(user_data, status=status.HTTP_200_OK)
            response.set_cookie(
                key='token',
                value=tokens['access'],
                httponly=True,
                secure=True,
                samesite='Lax'
            )
            return response
        except requests.RequestException as e:
            return Response({'error': 'Request failed: {}'.format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def check_auth(self, request):
        try:
            token = request.COOKIES.get('token')
            if not token:
                return Response({'message': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
            UntypedToken(token)
            print(UntypedToken(token))
            return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'message': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
