
from django.urls import path, include
from .views import PlayerViewSet
from rest_framework import routers
from .views import get_ping_data_by_username ,get_all_ping_data, get_all_tic_data, get_tic_data_by_username
# from rest_framework_simplejwt.views import TokenRefreshView ,TokenObtainPairView

router = routers.DefaultRouter()
router.register('Player', PlayerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # path ('users/', PlayerViewSet.as_view({'get': 'get_all_users'}), name='users'),
    # path ('users/<str:login>/', PlayerViewSet.as_view({'get': 'get_user'}), name='user'),
    # path ('users/update/', PlayerViewSet.as_view({'put': 'update_user'}), name='update_user'),
    path('login/', PlayerViewSet.as_view({'post': 'login'})),
    path('auth_intra/', PlayerViewSet.as_view({'get': 'auth_intra'})),
    path('logout/', PlayerViewSet.as_view({'get': 'logout'})),
    path('token_status/',PlayerViewSet.as_view({'get': 'token_status'})),
    path('user_status/',PlayerViewSet.as_view({'get': 'user_status'})),
    path('check2fa/',PlayerViewSet.as_view({'post': 'check_2fa'})),
    path('getusers/',PlayerViewSet.as_view({'get': 'getallusers'})),
    path('qrcode/',PlayerViewSet.as_view({'get': 'generate_qr_code'})),
    # path('verify_token/', PlayerViewSet.as_view({'post': 'verify_token'})),
    path ('verifytoken/', PlayerViewSet.as_view({'post': 'verifytoken'})),
    # path ('checktwofa/', PlayerViewSet.as_view({'get': 'checktwofa'})),
    # path('setup_2fa/'),PlayerViewSet.as_view({'post': 'setup_2fa'}),
    # path('verify_2fa/'),PlayerViewSet.as_view({'post': 'verify_2fa'}),
    # path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('getuser/<str:username>/', PlayerViewSet.as_view({'get': 'get_user_by_profile_name'}), name='get_user'),
    path('search/', PlayerViewSet.as_view({'get': 'search_users'}), name='search_users'),
    path('pingdata/', get_all_ping_data, name='get_all_ping_data'),
    path('ticdata/', get_all_tic_data, name='get_all_tic_data'),
    path('pingdata/<str:username>/', get_ping_data_by_username, name='get_ping_data_by_username'),
    path('ticdata/<str:username>/', get_tic_data_by_username, name='get_tic_data_by_username'),
]
