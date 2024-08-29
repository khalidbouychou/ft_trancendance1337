from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth.models import AbstractUser

class myuser(AbstractUser):
    username = models.CharField(max_length=255, default='default_username', unique=True, blank=False)
    avatar = models.URLField(max_length=200, default='default_avatar')
    email = models.EmailField(max_length=200, default='default')
    two_factor = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, default='000000')
    otp_verified = models.BooleanField(default=False)


    def __str__(self):
        return self.username


    class Meta:
        db_table = 'player'
