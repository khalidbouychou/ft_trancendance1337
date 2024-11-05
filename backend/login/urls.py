
from django.urls import path, include
from .views import PlayerViewSet, SignupForm, SigninForm , GenerateQRcode ,DesableTwoFactor , LogoutView , UserStatus ,VerifyOtp
from rest_framework import routers
from .views import health_check , AuthUser
router = routers.DefaultRouter()
router.register('Player', PlayerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', PlayerViewSet.as_view({'post': 'login'})),
    path('auth_intra/', PlayerViewSet.as_view({'get': 'auth_intra'})),
    path('users/', PlayerViewSet.as_view({'get': 'getusers'})),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('health/', health_check, name='health_check'),
    path('user/', AuthUser.as_view(), name='auth_user'),
    path('signup/', SignupForm.as_view(), name='signup'),
    path('singin/', SigninForm.as_view(), name='singin'),
    path('qrcode/',GenerateQRcode.as_view(), name='qrcode'),
    path('user_status/',UserStatus.as_view(), name='user_status'),
    path('d_2fa/',DesableTwoFactor.as_view(), name='disabletwofactor'),
    path('otpverify/',VerifyOtp.as_view(), name='VerifyOtp'),

    ]
