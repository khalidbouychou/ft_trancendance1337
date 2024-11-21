
from django.urls import path, include
from .views import PlayerViewSet, SignupForm, SigninForm, GenerateQRcode, DesableTwoFactor, LogoutView, UserStatus, VerifyOtp, ClearQrcode, health_check, AuthUser, get_ping_data_by_username, get_all_ping_data, get_all_tic_data
from rest_framework import routers
router = routers.DefaultRouter()
router.register('Player', PlayerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', PlayerViewSet.as_view({'post': 'login'})),
    path('auth_intra/', PlayerViewSet.as_view({'get': 'auth_intra'})),
    path('getusers/', PlayerViewSet.as_view({'get': 'getallusers'})),
    path('getuser/<str:username>/', PlayerViewSet.as_view({'get': 'get_user_by_profile_name'}), name='get_user'),
    path('search/', PlayerViewSet.as_view({'get': 'search_users'}), name='search_users'),
    path('pingdata/', get_all_ping_data, name='get_all_ping_data'),
    path('ticdata/', get_all_tic_data, name='get_all_tic_data'),
    path('pingdata/<str:username>/', get_ping_data_by_username, name='get_ping_data_by_username'),
    path('users/', PlayerViewSet.as_view({'get': 'getusers'})),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('health/', health_check, name='health_check'),
    path('user/', AuthUser.as_view(), name='auth_user'),
    path('signup/', SignupForm.as_view(), name='signup'),
    path('singin/', SigninForm.as_view(), name='singin'),
    path('qrcode/', GenerateQRcode.as_view(), name='qrcode'),
    path('user_status/', UserStatus.as_view(), name='user_status'),
    path('d_2fa/', DesableTwoFactor.as_view(), name='disabletwofactor'),
    path('otpverify/', VerifyOtp.as_view(), name='VerifyOtp'),
    path('clearqrcode/', ClearQrcode.as_view(), name='ClearQrcode'),
    path('d_2fa/',DesableTwoFactor.as_view(), name='disabletwofactor'),
    path('otpverify/',VerifyOtp.as_view(), name='VerifyOtp'),
    path('clearqrcode/',ClearQrcode.as_view() , name='ClearQrcode'), 
] + router.urls
