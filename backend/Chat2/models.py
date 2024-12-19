from django.db import models
from login.models import Player
from django.utils import timezone
# Create your models here.

class Room(models.Model):
    id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='room_user1')
    user2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='room_user2')
    created_time = models.DateTimeField(default=timezone.now)
    modified_time = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['modified_time']
        unique_together = ['user1', 'user2']

    def other_user(self, user):
        if user == self.user1:
            return self.user2
        if user == self.user2:
            return self.user1
        raise ValueError("User is not part of this chat room.")
    
class Message(models.Model):
    
