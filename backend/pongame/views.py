# views.py
from django.http import JsonResponse
from .consumers import GameStateManager
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from login.models import Player, PingData

@api_view(['GET'])
def game_state_view(request, room_name):
    game_state = GameStateManager.get_state(f'{room_name}')
    if game_state:
        return JsonResponse(game_state)
    else:
        return JsonResponse({'error': 'Game state not found'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_data(request):
    context = {
        'user': request.user.username,
        'avatar': request.user.avatar,
        'exp_game': PingData.objects.get(player=request.user).exp_game,
    }
    return JsonResponse(context)