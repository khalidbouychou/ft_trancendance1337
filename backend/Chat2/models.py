from django.db import models
from login.models import Player

class ChatRoom(models.Model):
    user1 = models.ForeignKey(Player, related_name='chatroom_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(Player, related_name='chatroom_user2', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_room"
    
    def __str__(self):
        return f"ChatRoom: {self.user1.profile_name} and {self.user2.profile_name}"

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(Player, related_name='sent_messages', on_delete=models.CASCADE)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "message"
    def __str__(self):
        return f"Message from {self.sender.profile_name} in ChatRoom {self.chat_room.id}"
