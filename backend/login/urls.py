
from django.urls import path, include
from .views import *


urlpatterns = [
    path('anonymize/', AnonymizeAccount.as_view(), name='anonymize'),
    path('delete/', DeleteAccount.as_view(), name='delete'),
    path('check2fa/',PlayerViewSet.as_view({'post': 'check_2fa'})),
    path('pingdata/<str:username>/', get_ping_data_by_profile_name, name='get_ping_data_by_profile_name'),
    path('login/', PlayerViewSet.as_view({'post': 'login'})),
    path('auth_intra/', PlayerViewSet.as_view({'get': 'auth_intra'})),
    path('getuser/<str:username>/', PlayerViewSet.as_view({'get': 'get_user_by_profile_name'}), name='get_user'),
    path('search/', PlayerViewSet.as_view({'get': 'search_users'}), name='search_users'),
    path('pingdata/', get_all_ping_data, name='get_all_ping_data'),
    
    path('users/', PlayerViewSet.as_view({'get': 'getusers'})),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', AuthUser.as_view(), name='auth_user'),
    path('signup/', SignupForm.as_view(), name='signup'),
    path('singin/', SigninForm.as_view(), name='singin'),
    path('qrcode/', GenerateQRcode.as_view(), name='qrcode'),

    path('d_2fa/',DesableTwoFactor.as_view(), name='disabletwofactor'),
    path('otpverify/',VerifyOtp.as_view(), name='VerifyOtp'),
    path('clearqrcode/',ClearQrcode.as_view() , name='ClearQrcode'),
    path('update/',UpdateProfile.as_view() , name='UpdateProfile'),
    path('friends/<str:profile_name>/', UserNameFriendList.as_view()), 
    path('blocked/<str:profile_name>/', UserNameBlockedList.as_view()), 


    ]
