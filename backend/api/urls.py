from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView ,TokenObtainPairView, TokenVerifyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('login.urls')),
    path ('api-auth/', include('rest_framework.urls')),
     path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
     path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
     
    #  path('pongame/', include('pongame.urls')),
    #  path('secondgame/', include('secondgame.urls')),
    #  path ('profile/', include('userprofile.urls')),
    #  path ('chat/', include('chat.urls')),
]