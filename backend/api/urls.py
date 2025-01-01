from django.contrib import admin
from django.urls import path, include
from login import views
from matches import views
# from .views import *
from rest_framework_simplejwt.views import TokenRefreshView ,TokenObtainPairView, TokenVerifyView

import os
from django.conf import settings
from django.conf.urls.static import static
 
urlpatterns = [
    path('api/', include('login.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/notif/', include('notification.urls')),
    path('matches/', include('matches.urls')),
    path('api/', include('pongame.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/pingpong/', include('pongame.urls')), 
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #---------------game urls------------------ 
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)  
