from django.urls import path
from .views import list_chat

urlpatterns = [
    path('', list_chat.as_view(), name="chat"),
]
