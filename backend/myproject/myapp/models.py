from django.db import models
from django.core.validators import MinLengthValidator

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=10, unique=True, blank=False,validators=[MinLengthValidator(5)])
    login = models.CharField(max_length=10, unique=True, blank=False)
    level = models.IntegerField(blank=False)
    ratio = models.IntegerField(blank=False)
    percentage = models.IntegerField(blank=False)
    match_total = models.IntegerField(blank=False)
    wins = models.IntegerField(blank=False)
    losses = models.IntegerField(blank=False)
    
class FriendShip(models.Model):
    user = models.ForeignKey(User, related_name='fiends', on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name='fiends_of', on_delete=models.CASCADE)

class BlockedFriend(models.Model):
    user = models.ForeignKey(User, related_name='blocked_fiends', on_delete=models.CASCADE)
    blocked_friend = models.ForeignKey(User, related_name='blocked_by', on_delete=models.CASCADE)
    
# class MatchHistory(models.Model):
#     player1 = models.ForeignKey(User, related_name='matches_as_player1', on_delete=)