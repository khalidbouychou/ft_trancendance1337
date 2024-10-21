
from rest_framework.response import Response
from django.http import JsonResponse
import requests
from django.contrib.auth.models import User
from .serializers import PlayerSerializer, PingDataSerializer, TicDataSerializer
from .models import Player ,PingData
from rest_framework import viewsets, status
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth import get_user_model
from django.db.models import Sum
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

    def search_users(self, request):
        search_query = request.query_params.get('q', None)
        if search_query:
            users = Player.objects.filter(profile_name__icontains=search_query)
            serializer = PlayerSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No search query provided'}, status=status.HTTP_400_BAD_REQUEST)
 
    def get_user_by_profile_name(self, request, username):
        try:
            print('username ==>', username)
            user = Player.objects.get(username=username)
            serializer = PlayerSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

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
            profile_name=user_data['username'],
            avatar=user_data['avatar'],
            email=user_data['email'],
            wins=0,
            losses=0,
            exp_game=0,
            status_network='online',
            status_game='offline',
            two_factor=False,
            otp='000000',
            otp_verified=False,
        )
        user.avatar = user_data['avatar']
        user.cover = user_data['avatar']
        user.email = user_data['email']
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
            # Check if user exists
            user = Player.objects.filter(
                username=user_data['username']).first()
            if not user:
                user = self.create_user(user_data)

            print('user ---- >', user)
            # Create JWT tokens
            tokens = self.create_jwt_token(user)
            # Create response
            user = {
                'token': tokens['access'],
                'username': user.username,
                'profile_name': user.username,
                'avatar': user.avatar,
                'email': user.email,
                'two_factor': user.two_factor,
                'is_online': user.status_network,
                'status_game': user.status_game,
            }
            response_data = {
                'msg': 'success',
                'user': user,
            }
            response = Response(response_data, status=status.HTTP_200_OK)
            response.set_cookie(
                key='token',
                value=tokens['access'],
                httponly=True,
                secure=True,
                samesite='None'
            )
            return response
        except requests.RequestException as e:
            return Response({'error': 'Request failed: {}'.format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def logout(self, request):
        try:
            token = request.COOKIES.get('access')
            if not token:
                return Response({'msg': 'none'}, status=status.HTTP_200_OK)
            response = Response({'msg': 'Token deleted'},
                                status=status.HTTP_200_OK)
            response.delete_cookie('access')
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def user_status(self, request):
        token = request.COOKIES.get('access')
        if not token:
            return Response({'msg': 'none'}, status=status.HTTP_200_OK)
        try:
            print('user_status ---- >', token)
            AccessToken(token)
            return Response({'msg': 'isauth'}, status=200)
        except Exception:
            return Response({'msg': 'notauth'}, status=400)

    def check_2fa(self, request):
        player = request.user
        serializer = PlayerSerializer(player)
        return Response(serializer.data)

    def getallusers(self, request):
        players = Player.objects.all()
        serializer = PlayerSerializer(players, many=True)
        users = [{
            'username': player['username'],
            'avatar': player['avatar'],
            'email': player['email'],
            'two_factor': player['two_factor'],
            'is_online': player['is_online']
        }
            for player in serializer.data
        ]
        return Response(users)

    def verifytoken(self, request):
        try:
            token = request.COOKIES.get('token')
            if not token:
                return Response({'msg': 'Token is invalid or expired'}, status=status.HTTP_400_BAD_REQUEST)
            decoded_token = AccessToken(token)
            payload = decoded_token.payload
            if not payload.get("user_id"):
                return Response({'msg': 'Token is invalid or expired '}, status=status.HTTP_400_BAD_REQUEST)
            user = Player.objects.get(id=payload.get("user_id"))
            print('user ---- >', user)
            data = {
                'msg': 'valid',
                'user': PlayerSerializer(user).data
            }
            return Response(data)
        except Exception as e:
            print('error ---- >', e)
            return Response({'msg': 'Token is invalid or expired'}, status=status.HTTP_400_BAD_REQUEST)


def get_ping_data_by_username(request, username):
    Player = get_user_model()  # Get the custom user model (Player in your case)
    
    # First, find the player by username
    try:
        player = Player.objects.get(username=username)  # Get the player by username
    except Player.DoesNotExist:
        return JsonResponse({'error': 'Player not found'}, status=404)
    
    # Then filter PingData by the found player
    pingdata = PingData.objects.filter(player=player)
    serializer = PingDataSerializer(pingdata, many=True)
    data = serializer.data
    print("--------->", data)
    
    return JsonResponse(data, safe=False)

def get_all_ping_data(request):
    # Get all players, and annotate their exp_game by summing the related PingData exp_game
    players = Player.objects.annotate(total_exp_game=Sum('ping_data__exp_game')).order_by('-total_exp_game')
    
    all_ping_data = []

    # Loop through each player to get their ping data
    for player in players:
        pingdata = PingData.objects.filter(player=player)  # Get ping data for each player
        serializer = PingDataSerializer(pingdata, many=True)
        
        # Append the player's username and their ping data
        all_ping_data.append({
            'username': player.username,
            'total_exp_game': player.total_exp_game or 0,  # Use 0 if no ping data
            'ping_data': serializer.data,
        })

    return JsonResponse(all_ping_data, safe=False)

#------------------------------------------------------------------------------------------------

