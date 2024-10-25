
from rest_framework.response import Response
import requests
from django.contrib.auth.models import User
from .serializers import PlayerSerializer
from .models import Player as Player
from rest_framework import viewsets, status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken , BlacklistedToken , OutstandingToken
from rest_framework.authentication import SessionAuthentication
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.contrib.auth import login , logout as django_logout
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout 
from rest_framework_simplejwt.exceptions import TokenError
from datetime import timedelta
from rest_framework.decorators import action
import logging
import os

from rest_framework.views import APIView

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
        user = Player.objects.create(
            username=user_data['username'],
            avatar=user_data['avatar'],
            profile_name=user_data['username'],
            status_network='online',
        )
        # user.set_unusable_password()  # Assuming password is not used
        user.save()
        return user

    def auth_intra(self, request):
        CID = os.environ.get('C_ID')
        REDIRECT_URI = os.environ.get('REDIRECT_URI')
        try:
            response = Response(
                {'url': f'https://api.intra.42.fr/oauth/authorize?client_id={CID}&redirect_uri={REDIRECT_URI}&response_type=code'}, status=status.HTTP_200_OK)
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
                    'client_id': os.environ.get('C_ID'),
                    'client_secret': os.environ.get('SCID'),
                    'code': request.data.get('code'),
                    'redirect_uri': os.environ.get('REDIRECT_URI')
                }
            )
            response.raise_for_status()
            
            token = response.json().get('access_token')
            if not token:
                return Response({'error': 'Intra Token not provided'}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch user data
            headers = {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
            response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
            response.raise_for_status()
            
            intra_data = response.json()
            user_data = {
                'username': intra_data.get('login'),
                'avatar': intra_data.get('image')['link'],
                'profile_name': intra_data.get('login'),
            }
            # Check if user exists
            user = Player.objects.filter(
                username=user_data['username']).first()
            if not user:
                user = self.create_user(user_data)
            authenticate(request, username=user_data['username'])
            login(request, user)
            # Create JWT tokens
            tokens = self.create_jwt_token(user)
            print('+++++++++++++++ > ',tokens)
            # Create response
            data = {
                'user': {
                    'token': tokens['access'],
                    'refresh': tokens['refresh'],
                    'username': user.username,
                    'avatar': user.avatar,
                    'is_authenticated': request.user.is_authenticated,
                },
            }

            response = Response(data, status=status.HTTP_200_OK)
            response.set_cookie(key='token', value=tokens['access'], secure=True , httponly=True ,samesite='None' ) 
            response.set_cookie(key='refresh', value=tokens['refresh'], secure=True , httponly=True , samesite='None')
            
            return response
        except requests.RequestException as e:
            return Response({'error': 'Request failed: {}'.format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def getusers (self,request):
        users = Player.objects.all()
        data = PlayerSerializer(users, many=True)
        return Response(data.data, status=status.HTTP_200_OK)
    def check_authentication(self, request):
        try:
            token = request.COOKIES.get('token')
            if token:
                try:
                    access_token = AccessToken(token)
                    user = access_token.user
                    if user and user.is_authenticated:
                        return True, user, "Authenticated via token"
                    
                except TokenError:
                    return False, None, "Invalid or expired token"
            # Check session authentication
            if request.user.is_authenticated:
                return True, request.user, "Authenticated via session"
            return False, None, "No valid authentication found"
        except Exception as e:
            return False, None, f"Authentication error: {str(e)}"
    
 
  

    def logout(self, request):
        try:
            token = request.COOKIES.get('token')
            if token:
                try:
                    access_token = AccessToken(token)
                    if not access_token:
                        return Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
                    user_id = access_token.payload.get('user_id')
                    if not user_id:
                        return Response({'error': 'No user ID found in token'}, status=status.HTTP_400_BAD_REQUEST)
                    user = Player.objects.filter(id=user_id).first()
                    if user and user.is_authenticated:
                        user.status_network = 'offline'
                        user.status_game = 'offline'
                        user.save()
                        django_logout(request)
                        # access_token.blacklist()  # Blacklist the token if using blacklisting
                        response = Response({'msg': 'Logged out'}, status=status.HTTP_200_OK)
                        response.delete_cookie('token')  # Delete token cookie
                        response.delete_cookie('refresh')  # Delete refresh cookie
                        response.delete_cookie('sessionid')  # Delete sessionid cookie
                        response.delete_cookie('csrftoken')  # Delete csrftoken cookie
                        return response
                    else:
                        return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
                except TokenError:
                    return Response({'error': 'Given token not valid for any token type'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'No valid authentication found'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#------------------------------------------------------------------------------------------------

from django.http import HttpResponse
def health_check(request):
    return HttpResponse("OK", status=200)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
class AuthUser(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            print('user',user)
            if user.is_authenticated:
                data = {
                   'data': PlayerSerializer(user).data,
                   'token': request.COOKIES.get('token'),
                }
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'User not authenticated'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) 

from rest_framework.views import APIView
from rest_framework.response import Response
class VerifyToken(APIView): 
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get (self, request):
       token = request.COOKIES.get('token')
       print ('token',token)
       Response({'msg': 'Token is valid'}, status=status.HTTP_200_OK)