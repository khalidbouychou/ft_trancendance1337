
from django.urls import path, include
from .views import PlayerViewSet
from rest_framework import routers
# from rest_framework_simplejwt.views import TokenRefreshView ,TokenObtainPairView

router = routers.DefaultRouter()
router.register('Player', PlayerViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', PlayerViewSet.as_view({'post': 'login'})),
    path('auth_intra/', PlayerViewSet.as_view({'get': 'auth_intra'})),
    path('users/', PlayerViewSet.as_view({'get': 'getusers'})),
    ]
