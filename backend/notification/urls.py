from django.urls import path
from .views import *

urlpatterns = [
    path('notif/', NotificationView.as_view(), name='notifications'),
]
