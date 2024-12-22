from django.urls import path
from .views import ChatRoomsView

urlpatterns = [ path('', ChatRoomsView.as_view(), name="chat"), ]