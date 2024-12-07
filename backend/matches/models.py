from django.db import models
from login.models import Player

# Create your models here.
class Matches(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE , related_name='player')
    opponent = models.ForeignKey(Player, on_delete=models.CASCADE , related_name='opponent')
    date = models.DateTimeField(auto_now_add=True)
    winner = models.CharField(max_length=100, default='')
    loser = models.CharField(max_length=100, default='')
    winner_profile_name = models.CharField(max_length=100, default='')
    loser_profile_name = models.CharField(max_length=100, default='')
    winner_avatar = models.URLField(max_length=200)
    loser_avatar = models.URLField(max_length=200)
    left_score = models.IntegerField()
    right_score = models.IntegerField()
    game_type = models.CharField(max_length=100, default='')

    class Meta:
        db_table = 'matches'
    
    def __str__(self):
        return self.player.username + ' vs ' + self.opponent.username
