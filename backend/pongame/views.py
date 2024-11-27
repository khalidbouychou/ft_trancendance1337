# views.py
from django.http import JsonResponse
from rest_framework.response import Response
from .consumers import GameStateManager
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from login.models import Player, PingData
from login.serializers import PingDataSerializer
  
@api_view(['GET'])
def game_state_view(request, room_name):
    game_state = GameStateManager.get_state(f'{room_name}')
    if game_state:
        return JsonResponse(game_state)
    else:
        return JsonResponse({'error': 'Game state not found'}, status=404)
    
@api_view(['GET'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated])
def game_xp(request):
    # This line is invalid and not necessary
    # {"detail":"Authentication credentials were not provided."}
     
    print(f"Request: {request} User: {request.user}, Authenticated: {request.user.is_authenticated}")
    try:
        # Fetch all PingData objects
        print("test:", PingData.objects.get(player=request.user))
        test = PingData.objects.get(player=request.user)
  
        # Serialize the PingData objects
        data = PingDataSerializer(test) 
  
        # Return the serialized data as a response
        return Response(data.data)
    except Exception as e:
        # Handle any errors gracefully
        print("Error:", e)
        return JsonResponse({'error': str(e)}, status=500)