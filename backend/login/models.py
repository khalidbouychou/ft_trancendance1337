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
    avatar = models.URLField(max_length=200 , default='https://www.gravatar.com/avatar/')
    profile_name = models.CharField(max_length=50, default='Player')
    status_network = models.CharField(max_length=10, choices=STATUS, default='offline')
    status_game = models.CharField(max_length=10, choices=GAME_STATUS, default='offline')
    two_factor = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=255, default='none' ,blank=False , null=False) 
    otp_verified = models.BooleanField(default=False)
    qrcode_path = models.CharField(max_length=255, default='', blank=False, null=False) 
    bool_login = models.BooleanField(default=False)
    
    class Meta: 
        db_table = 'player' 




       