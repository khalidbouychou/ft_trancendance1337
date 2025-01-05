
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Player

class UserConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            self.user.status_network= 'online'
            await self.channel_layer.group_add(
                self.user.username,
                self.channel_name
            )
            await self.accept()
        else:
            self.user.is_online = False
            await self.close()

    async def disconnect(self, close_code):
        self.user.status_network= 'offline'
        await self.channel_layer.group_discard(
            self.user.username,
            self.channel_name
        )