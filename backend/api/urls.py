from django.contrib import admin
from django.urls import path, include
from login import views
from matches import views
from pongame import views
from Chat2 import views
from rest_framework_simplejwt.views import TokenRefreshView ,TokenObtainPairView, TokenVerifyView
import os
from django.conf import settings
from django.conf.urls.static import static
 
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('login.urls')),
    path('api/', include('Chat2.urls')),
    path('api/notif/', include('notification.urls')),
    path('api/', include('matches.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/', include('pongame.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    # path('api/matches/', views.Matches_list),
    # path('api/user/<str:username>/', views.Matches_by_user),
    # path ('api-auth/', include('rest_framework.urls')),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # path ('api-auth/', include('rest_framework.urls')),
    #---------------game urls------------------
    # path('game/', include('game.urls')),
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)  
