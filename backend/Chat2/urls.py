from django.urls import path
from .views import ChatRoomsView

urlpatterns = [ path('chat/', ChatRoomsView.as_view(), name="chat"), ]