from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models

class Player(AbstractUser):
    STATUS = (
        ('online', _('online')),
        ('offline', _('offline')),
    )
    GAME_STATUS = (
        ('available', _('available')),
        ('waiting', _('waiting')),
        ('playing', _('playing')),
        ('offline', _('offline')),
    )
    username = models.CharField(max_length=255, default='default_username', unique=True, blank=False)
    profile_name = models.CharField(max_length=200, default='default_username')
    avatar = models.URLField(max_length=200, default='https://upload.wikimedia.org/wikipedia/commons/1/1e/Default-avatar.jpg')
    status_network = models.CharField(max_length=10, choices=STATUS, default='offline')
    status_game = models.CharField(max_length=10, choices=GAME_STATUS, default='offline')
    two_factor = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, default='000000')
    otp_verified = models.BooleanField(default=False)
    blocked_users = models.ManyToManyField('self', symmetrical=False, related_name='blocked_by', blank=True)
    friends = models.ManyToManyField('self', symmetrical=True, through='Friend', blank=True)
    qrcode_path = models.CharField(max_length=255, default='', blank=False, null=False) 
    bool_login = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=255, default='none' ,blank=False , null=False)
    
    class Meta: 
        db_table = 'player' 

    def save(self, *args, **kwargs):
        if self.status_network == 'offline':
            self.status_game = 'offline'
        super().save(*args, **kwargs)

    def block_user(self, user_to_block):
        self.blocked_users.add(user_to_block)

    def unblock_user(self, user_to_unblock):
        self.blocked_users.remove(user_to_unblock)

    def is_blocked(self, user):
        return self.blocked_users.filter(id=user.id).exists()
    
    def unfriend_user(self, user_to_unfriend):
        self.friends.remove(user_to_unfriend)

    @staticmethod
    def are_enemies(user1, user2):
        return user1.is_blocked(user2) or user2.is_blocked(user1)

class Friend(models.Model):
    STATUS = (
        ('None', _('None')),
        ('pending', _('pending')),
        ('friends', _('friends')),
    )

    user1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="friend_user1")
    user2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="friend_user2")
    status = models.CharField(max_length=10, choices=STATUS, default='None')

    class Meta:
        unique_together = ['user1', 'user2', 'status']

class PingData(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='ping_data')
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0) 
    exp_game = models.IntegerField(default=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ping_data'