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
def get_matches_by_username(request, username):
    matches = Matches.objects.filter(Q(winner=username)|Q(loser=username))
    serializer = MatchesSerializer(matches, many=True)
    return Response(serializer.data)
