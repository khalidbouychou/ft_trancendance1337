
from rest_framework.response import Response
from django.http import JsonResponse
import requests
from .serializers import *
from .models import *
from rest_framework import viewsets, status
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken,TokenError
from django.http import JsonResponse
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth import login , logout as django_logout
import os
from rest_framework import generics
from rest_framework.views import APIView
import pyotp
import qrcode
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
import random
import cloudinary
import cloudinary.uploader
from django.core.files.storage import default_storage
from django.db.models import Sum
#---------------------------------CHECK HEALTH OF THE BACKEND-----------------------------------------------------------

def DeleteCookies(response: Response) -> Response:
    response.delete_cookie('csrftoken')
    response.delete_cookie('token')
    response.delete_cookie('refresh')
    response.delete_cookie('sessionid')

    return response

#---------------------------------CHECK HEALTH OF THE BACKEND-----------------------------------------------------------

#------------------------------------LOGIN INTRA------------------------------------------------------------

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
            user = Player.objects.get(profile_name=username)
            serializer = PlayerSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def create_user(self, user_data):
        user = Player.objects.create(
            username=user_data['username'],
            avatar=user_data['avatar'],
            profile_name=user_data['username']+'_intra',
            status_network='online',
            bool_login=True,
        )
        p = PingData.objects.create(player=user)
        user.save()
        return user

    def auth_intra(self, request):
        CID = os.environ.get('C_ID')
        REDIRECT_URI = os.environ.get("REDIRECT_URI")
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
                    'redirect_uri': os.environ.get("REDIRECT_URI")
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
            if user.is_anonimized == True and user.is_active == False:
                return Response({'error': 'You Anonymized Your INTRA42 Account'}, status=status.HTTP_400_BAD_REQUEST)
            user.status_network='online'
            user.bool_login=True
            authenticate(request, username=user_data['username'])
            login(request, user)
            user.save()
            tokens = self.create_jwt_token(user)
            data= PlayerSerializer(user).data
            response = Response(data, status=status.HTTP_200_OK)
            is_secure = request.is_secure()
            response.set_cookie(key='token', value=tokens['access'], secure=is_secure , httponly=True ,samesite='Lax' )  
            return response
        except requests.RequestException as e:
            return Response({'error': 'Request failed: {}'.format(str(e))}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

#------------------------------------LOGIN INTRA------------------------------------------------------------

#-----------------------------------Logout-------------------------------------------------------------
class LogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            refresh = request.COOKIES.get('refresh')
            if not user.is_authenticated:
                return Response({'error': 'User not authenticated'}, status=status.HTTP_400_BAD_REQUEST)
            user.bool_login = False
            user.otp_verified = False
            user.status_network = 'offline'
            user.save()
            newrefresh = RefreshToken(refresh)
            newrefresh.blacklist()
            django_logout(request)
            response = Response({'msg': 'Logged out'}, status=status.HTTP_200_OK)
            return DeleteCookies(response)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AuthUser(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            token = request.COOKIES.get('token')
            if not token or token == 'null':
                response = Response({'error': 'Token not provided'}, status=status.HTTP_400_BAD_REQUEST)
                django_logout(request)
                return DeleteCookies(response)
            try:
                AccessToken(token)
            except TokenError as e:
                refresh = RefreshToken.for_user(user) 
                access = str(refresh.access_token)
                is_secure = request.is_secure()
                response = Response({'msg': 'Token refreshed', 'user':PlayerSerializer(user).data}, status=status.HTTP_200_OK)
                response.set_cookie(key='token', value=access , secure=is_secure, httponly=True ,samesite='Lax')
                return response
            userdata = PlayerSerializer(user).data
            return Response({'user' :userdata}, status=status.HTTP_200_OK)    

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) 
#-----------------------------------Logout-------------------------------------------------------------

#-----------------------------------Form-------------------------------------------------------------

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
                return Response({'error': f'No user found with {username}'}, status=status.HTTP_400_BAD_REQUEST)
            login(request, getuser)
            getuser.bool_login = True
            getuser.status_network = 'online'
            getuser.save()
            refresh = RefreshToken.for_user(getuser)
            access = str(refresh.access_token)
            is_secure = request.is_secure()
            response = Response({'msg': f'Welcome -- {username}'}, status=status.HTTP_200_OK)
            response.set_cookie(key='token', value=access , secure=is_secure, httponly=True ,samesite='Lax')
            response.data = {
                'user' : PlayerSerializer(getuser).data,
                'token': access,
            }               
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

#-----------------------------------Form-------------------------------------------------------------

#-----------------------------------2FA-------------------------------------------------------------

# Configuration       
cloudinary.config( 
    cloud_name = os.environ.get('CLOUD_NAME'),
    api_key = os.environ.get('API_KEY'),
    api_secret = os.environ.get('API_SECRET'),
    secure=os.environ.get('SECURE'),
)
class GenerateQRcode(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        user.mfa_secret = pyotp.random_base32()
        url  = qrcode.make(pyotp.totp.TOTP(user.mfa_secret).provisioning_uri(name=user.username, issuer_name='ft_transcendence'))
        createdir = os.path.exists('uploads')
        if not createdir:
            os.makedirs('uploads')
        number_random = random.randint(1, 10000000)
        num = number_random % 1000
        path = f'uploads/{user.username}_{num}.png'
        url.save(path)
        path_url = f'/app/{path}'
        cludinary_url = cloudinary.uploader.upload(path_url)
        qrcode_url = cludinary_url['url']
        user.qrcode_path = qrcode_url
        os.remove(path_url)
        user.save()
        response = Response({'msg': 'QR code generated'}, status=status.HTTP_200_OK)  
        response.data = {
            'user': PlayerSerializer(user).data,
        }
        return response


class DesableTwoFactor(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        user = request.user
        otp = request.data.get('otp')
        if not user.mfa_secret or not otp :
            return Response({'error': 'No secret found Or Otp invalide'}, status=status.HTTP_400_BAD_REQUEST)
        totp = pyotp.TOTP(user.mfa_secret)
        is_valid = totp.verify(otp)
        if not is_valid:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
        user.two_factor = False
        user.mfa_secret = ""
        user.otp_verified = True
        user.qrcode_path = ""
        user.save()
        data = PlayerSerializer(user).data
        response = Response({'msg': '2FA disabled'}, status=status.HTTP_200_OK)
        response.data = {'user': data}
        return response
        

class VerifyOtp(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        otp = request.data.get('otp')
        if not user.mfa_secret:
            return Response({'error': 'No secret found'}, status=status.HTTP_400_BAD_REQUEST) 
        totp = pyotp.TOTP(user.mfa_secret)
        is_valid = totp.verify(otp)
        if is_valid:
            user.two_factor = True
            user.otp_verified = True
            user.bool_login = True
            user.save()
            response = Response({'msg': 'OTP verified'}, status=status.HTTP_200_OK) 
            response.data = {'user': PlayerSerializer(user).data} 
            return response

        return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST) 

class ClearQrcode (APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        if not user.mfa_secret or not user.qrcode_path:
            return Response({'error': 'No secret found Or No QR code found'}, status=status.HTTP_400_BAD_REQUEST)
        user.qrcode_path = ""
        user.mfa_secret = ""
        user.save()
        return  Response({'msg': 'QR code cleared'}, status=status.HTTP_200_OK)



class UpdateProfile (APIView):
    authentication_classes = [SessionAuthentication] 
    permission_classes = [IsAuthenticated]
    
    def put(self,request):
        data = request.data
        profile_name = data.get('profile_name')
        user = request.user
        update = False
        new_profile_name = data.get('profile_name')
        new_avatar = data.get('avatar') 
        if new_profile_name is not None:
            if (len(new_profile_name) < 9 or len(new_profile_name) > 15):
                return Response({'error': 'Profile name must be between 9 and 15 characters'}, status=status.HTTP_400_BAD_REQUEST)
            user.profile_name = new_profile_name
            update = True
        if new_avatar is not None:
            file_obj = new_avatar
            file_name = default_storage.save(f'uploads/{file_obj.name}', file_obj)
            image_path = f'/app/{file_name}'
            cludinary_url = cloudinary.uploader.upload(image_path)
            user.avatar = cludinary_url['url']
            update = True
        if update:
            user.save()
        return Response({'msg': 'Profile updated' , "new data" : PlayerSerializer(user).data}, status=status.HTTP_200_OK)
#-----------------------------------2FA-------------------------------------------------------------
#-----------------------------------AnnonimizedAccount-------------------------------------------------------------
class AnonymizeAccount(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        user.is_active = False
        user.is_anonimized = True
        user.profile_name = f'Anonimized_{random.randint(1, 100)}'
        user.avatar = 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Aneka'
        user.status_network = 'offline'
        user.status_game = 'offline'
        user.save()
        response = Response({'msg': '************** Account anonymized ***************'}, status=status.HTTP_200_OK)
        return DeleteCookies(response)
#-----------------------------------AnnonimizedAccount-------------------------------------------------------------
#-----------------------------------DeleteAccount------------------------------------------------------------------
class DeleteAccount(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        user.delete()
        response = Response({'msg': '----------------- Account deleted --------------'}, status=status.HTTP_200_OK)
        return DeleteCookies(response)
#-----------------------------------DeleteAccount-------------------------------------------------------------


def get_ping_data_by_profile_name(request, username):
    Player = get_user_model()
    try:
        player = Player.objects.get(profile_name=username)
    except Player.DoesNotExist:
        return JsonResponse({'error': 'Player not found'}, status=404)
    pingdata = PingData.objects.filter(player=player)
    serializer = PingDataSerializer(pingdata, many=True)
    data = serializer.data
    return JsonResponse(data, safe=False) 

def get_all_ping_data(request):
    players = Player.objects.annotate(total_exp_game=Sum('ping_data__exp_game')).order_by('-total_exp_game') 
    all_ping_data = [] 
    for player in players:
        pingdata = PingData.objects.filter(player=player).order_by('-exp_game', '-wins')
        serializer = PingDataSerializer(pingdata, many=True)
        all_ping_data.append({
            'username': player.username,
            'profile_name': player.profile_name,
            'avatar': player.avatar,
            'data': serializer.data,
        })

    return JsonResponse(all_ping_data, safe=False)

class UserNameFriendList(APIView):
    authentication_classes = [SessionAuthentication] 
    permission_classes = [IsAuthenticated]

    def get(self,request, profile_name):
        try :
            user = Player.objects.get(profile_name=profile_name)
            if not user :
                return Response({'error': 'No user found'}, status=status.HTTP_400_BAD_REQUEST)
            friends = PlayerSerializer.get_friends(self,user)
            return Response({'friend list':friends , 'user':user.profile_name}, status=status.HTTP_200_OK)
        except Exception as e:
            e = 'No user found'
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserNameBlockedList (APIView):
    authentication_classes = [SessionAuthentication] 
    permission_classes = [IsAuthenticated]

    def get(self,request, profile_name):
        try :
            user = Player.objects.get(profile_name=profile_name)
            if not user :
                return Response({'error': 'No user found'}, status=status.HTTP_400_BAD_REQUEST)
            friends = PlayerSerializer.get_blocked_users(self,user)
            return Response({'blocked list':friends , 'user':user.profile_name}, status=status.HTTP_200_OK)
        except Exception as e:
            e = 'No user found'
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
