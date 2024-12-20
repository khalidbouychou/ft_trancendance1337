from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Matches
from .serializers import MatchesSerializer
from django.db.models import Q

@api_view(['GET'])
def get_matches(request):
    matches = Matches.objects.all()
    serializer = MatchesSerializer(matches, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_matches_by_profile_name(request, profile_name):
    matches = Matches.objects.filter(Q(winner_profile_name=profile_name)|Q(loser_profile_name=profile_name))
    serializer = MatchesSerializer(matches, many=True)
    return Response(serializer.data)
