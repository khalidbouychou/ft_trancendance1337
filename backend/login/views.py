
from rest_framework.response import Response
import requests
from django.contrib.auth.models import User
from .serializers import PlayerSerializer , SignupSerializer ,SigninSerializer
from .models import Player as Player
from rest_framework import viewsets, status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken , BlacklistedToken , OutstandingToken ,TokenError

from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.contrib.auth import login , logout as django_logout

from rest_framework_simplejwt.exceptions import TokenError
from datetime import timedelta
from rest_framework.decorators import action
import os
from django.http import HttpResponse
from rest_framework import generics
from django.forms.models import model_to_dict



import jwt

from rest_framework.exceptions import AuthenticationFailed

from rest_framework.views import APIView
import pyotp
import time
import qrcode
from rest_framework.decorators import api_view  , permission_classes , authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

#--------------------------------------------------------------------------------------------

def health_check(request):
    return HttpResponse("OK", status=200)
#--------------------------------------------------------------------------------------------
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
            user = Player.objects.filter(
                username=user_data['username']).first()
            if not user:
                user = self.create_user(user_data)
            authenticate(request, username=user_data['username'])
            login(request, user)
            tokens = self.create_jwt_token(user)
            user.oldtoken = tokens['access']
            user.save()
            data = {
                'user': {
                    'token': tokens['access'],
                    'refresh': tokens['refresh'],
                    'username': user.username,
                    'avatar': user.avatar,
                    'is_authenticated': request.user.is_authenticated,
                    'profile_name': user.profile_name,
                    'status_network': user.status_network,
                    'status_game': user.status_game,
                    'two_factor': user.two_factor,
                    'otp_verified': user.otp_verified,
                    
                },
            }

            response = Response(data, status=status.HTTP_200_OK)
             # Check if the request is secure (HTTPS)
            is_secure = request.is_secure()
            response.set_cookie(key='token', value=tokens['access'], secure=is_secure , httponly=True ,samesite='Lax' ) 
            response.set_cookie(key='refresh', value=tokens['refresh'], secure=is_secure , httponly=True , samesite='Lax') 
            
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
            if request.user.is_authenticated:
                return True, request.user, "Authenticated via session"
            return False, None, "No valid authentication found"
        except Exception as e:
            return False, None, f"Authentication error: {str(e)}"
    
 


#------------------------------------------------------------------------------------------------


#------------------------------------------------------------------------------------------------


class LogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response({'error': 'User not authenticated'}, status=status.HTTP_400_BAD_REQUEST)
            django_logout(request)
            response = Response({'msg': 'Logged out'}, status=status.HTTP_200_OK) 
            response.delete_cookie('token')
            response.delete_cookie('refresh')
            response.delete_cookie('sessionid')
            response.delete_cookie('csrftoken')
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class AuthUser(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            token = request.COOKIES.get('token')
            if not token:
                django_logout(request)
                response = Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
                response.delete_cookie('token')
                response.delete_cookie('refresh')
                response.delete_cookie('sessionid')
                response.delete_cookie('csrftoken')
                return response

            try:
                isvalid = AccessToken(token)
                # Token is valid
                print("isvalid-----", isvalid)
                print("token-------", token)
            except TokenError as e:
                # Token is invalid or expired
                django_logout(request)
                response = Response({'error': 'Invalid token or expired'}, status=status.HTTP_400_BAD_REQUEST)
                response.delete_cookie('token')
                response.delete_cookie('refresh')
                response.delete_cookie('sessionid')
                response.delete_cookie('csrftoken')
                return response

            # If token is valid, proceed with the response
            return Response({'msg': 'Token is valid'}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#------------------------------------------------------------------------------------------------

class VerifyToken(APIView): 
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get (self, request):
        try:
            serializer = PlayerSerializer(request.user).data
            if not serializer.get('oldtoken'):
                return Response({'error': 'No old token found'}, status=status.HTTP_400_BAD_REQUEST)
            oldtoken = serializer.get('oldtoken')
            if not oldtoken:
                return Response({'error': 'No old token found'}, status=status.HTTP_400_BAD_REQUEST)
            token = request.COOKIES.get('token')
            if not token:
                return Response({'error': 'No token found'}, status=status.HTTP_400_BAD_REQUEST)
            payload = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
            if not payload:
                return Response({'error': 'No payload found in token'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Token expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        

class SignupForm (generics.CreateAPIView):
    queryset = Player.objects.all()
    serializer_class = SignupSerializer
    

class SigninForm(generics.CreateAPIView):
    queryset = Player.objects.all()
    serializer_class = SigninSerializer

    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            getuser = Player.objects.filter(username=username)
            getuser = authenticate(username=username, password=password)
            if not getuser:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
            login(request, getuser)
            refresh = RefreshToken.for_user(getuser)
            access = str(refresh.access_token)
            # Check if the request is secure (HTTPS)
            is_secure = request.is_secure()
            response = Response(status=status.HTTP_200_OK) 
            response.set_cookie(key='token', value=access , secure=is_secure, httponly=True ,samesite='Lax')
            response.set_cookie(key='refresh', value=refresh , secure=is_secure, httponly=True ,samesite='Lax')
            removedfilieds =[
                'password',
                'mfa_secret',
                'first_name',
                'last_name',
                'email',
                'is_superuser',
                'is_staff',
                'is_active',
                'date_joined',
                'last_login',
                'groups',
                'user_permissions',
                'is_online',
                'is_staff',
            ]
            response.data = {
                'user' : model_to_dict(getuser, exclude=removedfilieds),
                'token': access,
            }               
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

#------------------------------------------------------------------------------------------------




class GenerateQRcode(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        print("-------------------->",request.user)
        user = request.user
        user.mfa_secret = pyotp.random_base32()
        url  = qrcode.make(pyotp.totp.TOTP(user.mfa_secret).provisioning_uri(name=user.username, issuer_name='ft_transcendence'))
        createdir = os.path.exists('uploads') #check if the directory exists 
        if not createdir:
            os.makedirs('uploads')
        url.save(f'uploads/{user.username}.png') 
        user.qrcode_path = f'uploads/{user.username}.png'
        user.save()
        response = Response({'msg': 'QR code generated'}, status=status.HTTP_200_OK)
        response.data = {
            'path': user.qrcode_path,
        }
        return response


class DesableTwoFactor(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        if not user.qrcode_path:
            return Response({'error': 'No QR code found'}, status=status.HTTP_400_BAD_REQUEST)
        user.two_factor = False
        user.otp_is_verified = False
        user.mfa_secret = ''
        if os.path.exists(user.qrcode_path):
            os.remove(user.qrcode_path)
        user.qrcode_path = ""        
        user.save()
        response = Response({'msg': '2FA disabled'}, status=status.HTTP_200_OK)
        response.data = {
            'path': user.qrcode_path,
        }
        return response