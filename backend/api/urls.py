from django.contrib import admin
from django.urls import path, include
from login import views
from matches import views
from rest_framework_simplejwt.views import TokenRefreshView ,TokenObtainPairView, TokenVerifyView

import os
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/matches/', views.Matches_list),
    # path('api/user/<str:username>/', views.Matches_by_user),
    path('matches/', include('matches.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/notif/', include('notification.urls')),
    path('api/pingpong/', include('pongame.urls')),
    path('api/', include('login.urls')),
    path ('api-auth/', include('rest_framework.urls')),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 
