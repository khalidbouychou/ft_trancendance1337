
from django.urls import path, include
from .views import PlayerViewSet, SignupForm, SigninForm
from rest_framework import routers
# from rest_framework_simplejwt.views import TokenRefreshView ,TokenObtainPairView

from .views import health_check , AuthUser , VerifyToken
router = routers.DefaultRouter()
router.register('Player', PlayerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', PlayerViewSet.as_view({'post': 'login'})),
    path('auth_intra/', PlayerViewSet.as_view({'get': 'auth_intra'})),
    path('users/', PlayerViewSet.as_view({'get': 'getusers'})),
    path('logout/', PlayerViewSet.as_view({'get': 'logout'})),
    path('health/', health_check, name='health_check'),
    # path('<str:username>/', PlayerViewSet.as_view({'get': 'get_auth_user'})),
    path('user/', AuthUser.as_view(), name='auth_user'),
    path ('verifytoken/', VerifyToken.as_view(), name='verify_token'),
    path('signup/', SignupForm.as_view(), name='signup'),
    path('singin/', SigninForm.as_view(), name='singin'),
    ]
