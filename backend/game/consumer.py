from login.models import Player
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from asgiref.sync import sync_to_async
from login.serializers import PlayerSerializer
import json
channel_names = {}
quee = []
# Async function to get player by username from the database
@sync_to_async
def get_player_by_username(username):
    return Player.objects.filter(username=username).first()
class GameConsumer(AsyncWebsocketConsumer):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    async def connect(self):
        await self.accept()
        user = self.scope['user']
        channel_names[user.username] = self.channel_name
        quee.append(user.username)
        if quee.__len__() == 2:
            user1 = await get_player_by_username(quee[0])
            user2 = await get_player_by_username(quee[1])
            user1_channel = channel_names[quee[0]]
            user2_channel = channel_names[quee[1]]
            group_name = f'user_{quee[0]}_vs_user_{quee[1]}'
            await self.channel_layer.group_add(group_name, user1_channel)
            await self.channel_layer.group_add(group_name, user2_channel) 
            await self.channel_layer.group_send(
                group_name,
                {
                    'type': 'start_game',
                    'message': {
                        'player1':  PlayerSerializer(user1).data,
                        'player2': PlayerSerializer(user2).data  
                    }
                }
            )
        if quee.__len__() == 2:
            quee.clear()
        print('********************* quee size', len(quee), flush=True)
        
    async def start_game(self, event):
        type = 'start_game'
        message = event['message']
        await self.send(text_data= json.dumps({
            'type': type,
            'message': message
        })
        )
        
    async def disconnect(self, close_code):
        print('********************* disconnected', flush=True)  
        await self.close()

    async def receive(self, text_data): 
        print('received')
        text_data = "siir t3acha"  
        await self.send(text_data)     