from django.contrib import admin
from django.urls import path, include
# from login import views
# from matches import views
# from pongame import views
# from Chat2 import views
# import os
from rest_framework_simplejwt.views import TokenRefreshView ,TokenObtainPairView, TokenVerifyView
from django.conf import settings
from django.conf.urls.static import static
 
urlpatterns = [ 
    path('admin/', admin.site.urls),
    path('api/', include('login.urls')),
    path('api/', include('Chat2.urls')),
    path('api/', include('notification.urls')),
    path('api/', include('matches.urls')),
    path('api/', include('pongame.urls')),
    path('api/web3/', include('web3_app.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)  
