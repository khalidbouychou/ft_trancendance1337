from django.db import models
from django.utils import timezone
from login.models import Player
from django.db.models import Q

class ChatRoom(models.Model):
    id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="chat_room_user1")
    user2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="chat_room_user2")
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user1', 'user2']
        ordering = ['modified_at']

    def get_other_user(self, user):
        return self.user2 if user == self.user1 else self.user1

    @classmethod
    def get_or_create_room(cls, user1, user2):
        room = cls.objects.filter(
            Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1)
        ).first()
        
        if not room:
            room = cls.objects.create(user1=user1, user2=user2)
            print("we create the room and set create to 1")
        return room

    def mark_messages_read(self, user):
        self.messages.exclude(sender=user).update(is_read=True)

    @property
    def last_message(self):
        return self.messages.order_by('created_at').first()

    def save(self, *args, **kwargs):
        if not self.id:
            # Get the maximum ID and add 1, or start from 1000 if no rooms exist
            max_id = ChatRoom.objects.aggregate(models.Max('id'))['id__max']
            self.id = (max_id or 999) + 1
        super().save(*args, **kwargs)

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="sent_messages")
    content = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['chat_room', 'created_at']),
            models.Index(fields=['sender', 'is_read'])
        ]

    @property
    def receiver(self):
        return self.chat_room.get_other_user(self.sender)

    # @classmethod
    # def get_unread_count(cls, user, chat_room=None):
    #     query = cls.objects.filter(is_read=False).exclude(sender=user)
    #     if chat_room:
    #         query = query.filter(chat_room=chat_room)
    #     return query.count()

    def save(self, *args, **kwargs):
        # Update the chat room's modified timestamp
        self.chat_room.modified_at = timezone.now()
        self.chat_room.save(update_fields=['modified_at'])
        super().save(*args, **kwargs)