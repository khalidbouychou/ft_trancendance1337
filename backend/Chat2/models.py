from django.db import models
from django.utils.translation import gettext_lazy as _
from .models import Player


class ChatRoom(models.Model):
    id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(Player, related_name="chat_rooms_as_user1", on_delete=models.CASCADE)
    user2 = models.ForeignKey(Player, related_name="chat_rooms_as_user2", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_room"
        unique_together = ["user1", "user2"]


class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(Player, related_name="sent_messages", on_delete=models.CASCADE)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "message"
        ordering = ["timestamp"]
