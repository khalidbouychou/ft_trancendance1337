from login.models import Player
from channels.generic.websocket import AsyncWebsocketConsumer

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('connected')
        await self.accept()
        
    async def disconnect(self, close_code):
        print('disconnected')
        await self.close()
    async def receive(self, text_data):
        print('received')
        text_data = "siir t3acha"
        await self.send(text_data)