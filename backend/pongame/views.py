# views.py
from django.http import JsonResponse
from .consumers import GameStateManager
from rest_framework.decorators import api_view, permission_classes , authentication_classes
from login.models import Player, PingData
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication 

from rest_framework.views import APIView

# @authentication_classes([SessionAuthentication])
# @permission_classes([IsAuthenticated])
# @api_view(['GET'])
# def game_state_view(request, room_name):
#     game_state = GameStateManager.get_state(f'{room_name}')
#     if game_state:
#         return JsonResponse(game_state)
#     else:
#         return JsonResponse({'error': 'Game state not found'}, status=404)
 
# @authentication_classes([SessionAuthentication]) 
# @permission_classes([IsAuthenticated])
# @api_view(['GET'])
# def user_data(request):
#     print("--------user:", request.user ,flush=True)  
#     context = {
#         'user': request.user.username,
#         'avatar': request.user.avatar,
#         'exp_game': PingData.objects.get(player=request.user).exp_game,
#     }
#     print("exp_game:", context.get('exp_game'), "user:", context.get('user'), "avatar:", context.get('avatar'))
#     return JsonResponse(context) 


class UserDataView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("--------user:", request.user ,flush=True)   
        context = {
            'user': request.user.username,
            'avatar': request.user.avatar,
            'exp_game': PingData.objects.get(player=request.user).exp_game,
        }
        print("exp_game:", context.get('exp_game'), "user:", context.get('user'), "avatar:", context.get('avatar'))
        return JsonResponse(context)
    