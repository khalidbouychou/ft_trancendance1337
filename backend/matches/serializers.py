from rest_framework import serializers

from .models import Matches


class MatchesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matches
        fields = ['player', 'opponent', 'date', 'winner', 'loser', 'winner_profile_name', 'loser_profile_name', 'winner_avatar', 'loser_avatar', 'left_score', 'right_score', 'game_type']
        