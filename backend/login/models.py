from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth.models import AbstractUser

class Player(AbstractUser):
    STATUS = (
        ('online', _('online')),
        ('offline', _('offline')),
    )
    STATUS_GAME = (
        ('waiting', _('waiting')),
        ('playing', _('playing')),
        ('finished', _('finished')),
        ('offline', _('offline')),
    )
    username = models.CharField(max_length=255, default='default_username', unique=True, blank=False)
    profile_name = models.CharField(max_length=255, default='default_username', blank=True)
    avatar = models.URLField(max_length=200, default='default_avatar')
    email = models.EmailField(max_length=200, default='default')
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    exp_game = models.IntegerField(default=0)
    status_network = models.CharField(max_length=10, choices=STATUS, default='offline')
    status_game = models.CharField(max_length=10, choices=STATUS_GAME, default='offline')
    two_factor = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, default='000000')
    otp_verified = models.BooleanField(default=False)
   
    class Meta:
        db_table = 'player'
        
#     def __str__(self):
#         return self.usernam
    
# class FriendShip(models.Model):
#     user = models.ForeignKey(Player, related_name='friends', on_delete=models.CASCADE)
#     friend = models.ForeignKey(Player, related_name='friends_of', on_delete=models.CASCADE)

# class BlockedFriend(models.Model):
#     user = models.ForeignKey(Player, related_name='blocked_fiends', on_delete=models.CASCADE)
#     blocked_friend = models.ForeignKey(Player, related_name='blocked_by', on_delete=models.CASCADE)