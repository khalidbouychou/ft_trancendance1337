from rest_framework import serializers
from .models import Notification
from login.serializers import PlayerSerializer

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'from_user', 'to_user', 'notif_type', 'game_type', 'status', 'created_at']

