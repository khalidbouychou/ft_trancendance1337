from rest_framework import serializers

from .models import Matches


class MatchesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matches
        fields = ['player', 'opponent', 'date', 'winner', 'loser', 'left_score', 'right_score', 'game_type']
        