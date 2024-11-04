from django.contrib import admin
from django.urls import path, include
from login import views
from rest_framework_simplejwt.views import TokenRefreshView ,TokenObtainPairView, TokenVerifyView
from django.conf import settings 
from django.conf.urls.static import static

urlpatterns = [
    path('api/', include('login.urls')),
    path ('api-auth/', include('rest_framework.urls')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 