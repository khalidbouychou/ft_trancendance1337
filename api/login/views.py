
from rest_framework.response import Response
import requests
from django.contrib.auth.models import User
from .serializers import PlayerSerializer
from .models import myuser as Player
from rest_framework import viewsets, status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate
from django.http import JsonResponse
from cryptography.fernet import Fernet

import random
from django.http import HttpResponse
import imaplib
import smtplib
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

C_ID = os.getenv('CID')
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

    def create_user(self, user_data):
        user = Player(
            username=user_data['username'],
            avatar=user_data['avatar'],
            email=user_data['email'],
        )
        user.avatar = user_data['avatar']
        user.email = user_data['email']
        user.set_unusable_password()  # Assuming password is not used
        user.save()
        return user

    def search_user_by_email(self,email):
        try:
            user = Player.objects.get(email=email)
            return user
        except ObjectDoesNotExist:
            return None

    def auth_intra(self, request):
        return Response({'url': f'https://api.intra.42.fr/oauth/authorize?client_id={C_ID}&redirect_uri={REDIRECT_URI}&response_type=code'}, status=status.HTTP_200_OK)

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
            response.raise_for_status()  # Check if the request was successful
            token = response.json().get('access_token')
            if not token:
                return Response({'error': 'Intra Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
            # Fetch user data
            headers = {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
            response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
            response.raise_for_status()  # Check if the request was successful
            intra_data = response.json()

            user_data = {
                'username': intra_data.get('login'),
                'avatar': intra_data.get('image')['link'],
                'email': intra_data.get('email'),
            }
            # Check if user exists
            user = Player.objects.filter(username=user_data['username']).first()
            if not user :
                user = self.create_user(user_data)

            # Create JWT tokens
            tokens = self.create_jwt_token(user)
            user.two_factor = True
            response_data = {
                'status': 'success',
                'tofa': user.two_factor,
                'otp': user.otp,
            }
            response = Response(response_data, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access',
                value=tokens['access'],
                httponly=True,
                secure=True,
                samesite='Lax'
            )
            return  response
        except requests.RequestException as e:
            return Response({'error': 'Request failed: {}'.format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def logout(self, request):
        try:
            token = request.COOKIES.get('access')
            if not token:
                return Response({'msg':'none'}, status=status.HTTP_200_OK)
            response = Response({'msg': 'Token deleted'},
                                status=status.HTTP_200_OK)
            response.delete_cookie('access')
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def token_status(self,request):
        try:
            token = request.COOKIES.get('access')
            if not token:
                return Response({'valid': False, 'error': 'Token not provided'}, status=status.HTTP_200_OK)
            AccessToken(token)
            return Response({'valid': True}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'valid': False, 'error': str(e)}, status=status.HTTP_200_OK)


    def user_status(self, request):
        token = request.COOKIES.get('access')
        if not token:
            return Response({'msg': 'none'}, status=status.HTTP_200_OK)
        try:
            print('user_status ---- >',token)
            AccessToken(token)
            return Response({'msg': 'isauth'}, status=200)
        except Exception:
            return Response({'msg': 'notauth'}, status=400)

    # def check_2fa(self, request):
    #     player = request.user
    #     serializer = PlayerSerializer(player)
    #     print('player ---- >',serializer.data)
    #     return Response(serializer.data)

    # def getallusers(self, request):
    #     players = Player.objects.all()
    #     serializer = PlayerSerializer(players, many=True)
    #     users =[{
    #         'username' : player['username'],
    #         'avatar' : player['avatar'],
    #         'email' : player['email'],
    #         'two_factor' : player['two_factor'],
    #         'is_online' : player['is_online']
    #     }
    #     for player in  serializer.data
    #     ]
    #     print('players ---- >',users)
    #     return Response(users)
