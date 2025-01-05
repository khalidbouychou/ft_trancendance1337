
from django.urls import path, include
from .views import *
from rest_framework import routers
from rest_framework import routers

urlpatterns = [
    path('anonymize/', AnonymizeAccount.as_view(), name='anonymize'),
    path('list_anonymized/', ListAnonymizeAccount.as_view(), name='list_anonimized'),
    path('delete/', DeleteAccount.as_view(), name='delete'),
    path('token_status/',PlayerViewSet.as_view({'get': 'token_status'})), 
    path('check2fa/',PlayerViewSet.as_view({'post': 'check_2fa'})),
    path ('verifytoken/', PlayerViewSet.as_view({'post': 'verifytoken'})),
    path('pingdata/<str:username>/', get_ping_data_by_username, name='get_ping_data_by_username'),
    path('ticdata/<str:username>/', get_tic_data_by_username, name='get_tic_data_by_username'),
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
    path('user/', AuthUser.as_view(), name='auth_user'),
    path('signup/', SignupForm.as_view(), name='signup'),
    path('singin/', SigninForm.as_view(), name='singin'),
    path('qrcode/', GenerateQRcode.as_view(), name='qrcode'),
    path('user_status/', UserStatus.as_view(), name='user_status'),
    path('d_2fa/', DesableTwoFactor.as_view(), name='disabletwofactor'),
    path('otpverify/', VerifyOtp.as_view(), name='VerifyOtp'),
    # path('clearqrcode/', ClearQrcode.as_view(), name='ClearQrcode'),
    path('d_2fa/',DesableTwoFactor.as_view(), name='disabletwofactor'),
    path('otpverify/',VerifyOtp.as_view(), name='VerifyOtp'),
    path('clearqrcode/',ClearQrcode.as_view() , name='ClearQrcode'),
    path('update/',UpdateProfile.as_view() , name='UpdateProfile'),
    path('friends/<str:username>/', UserNameFriendList.as_view()), 
    path('blocked/<str:username>/', UserNameBlockedList.as_view()), 
    ]
