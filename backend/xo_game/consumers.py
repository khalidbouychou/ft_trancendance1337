import uuid
import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from asgiref.sync import sync_to_async
from login.models import Player, TicData
from matches.models import Matches
import asyncio

players_queue = []

class Game(WebsocketConsumer):
    def connect(self):
        global players_queue

        if hasattr(self, 'room_name') and self.room_name in players_queue:
            players_queue.remove(self.room_name)

        if not players_queue:
            self.room_name = f"room_{uuid.uuid4().hex}"
            self.role = "host"
            players_queue.append(self.room_name)
        else:
            self.room_name = players_queue.pop()
            self.role = "guest"

        self.room_group_name = f"game_{self.room_name}"

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        if self.role == "guest":
            self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'role': self.role,
            }))
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'send_msg',
                    'message': 'you just got a pair',
                    'room_name': self.room_group_name,
                }
            )
        else:
            self.send(text_data=json.dumps({
                'msg_type': 'server update',
                'role': self.role,
                'message': 'waiting for your pair',
                'room_name': self.room_group_name
            }))
    
    def disconnect(self, close_code):
        global players_queue
        if self.room_name in players_queue:
            players_queue.remove(self.room_name)
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'send_msg',
                'message': 'pair disconnected',
                'room_name': self.room_group_name
            }
        )
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
    
    def receive(self, text_data):
        data = json.loads(text_data)
        #print("Data received in receive method:", data) 

        if data['message'] == "result":
            #print("Processing result data: winner(", data['win_score'], "):", data['winner'], ", loser(", data['lose_score'], "):", data['loser'])
            async_to_sync(self.store_stuff)(data)
        else:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'send_update',
                    'obj': data['obj'],
                    'message': data['message'],
                    'target': data['target'],
                }
            )

    def send_msg(self, event):
        message = event['message']
        room_name = event['room_name']
        self.send(text_data=json.dumps({
            'msg_type': 'server update',
            'message': message,
            'room_name': room_name
        }))

    def send_update(self, event):
        message = event['message']
        obj = event['obj']
        target = event['target']
        self.send(text_data=json.dumps({
            'msg_type': 'pair update',
            'message': message,
            'target': target,
            'obj': obj,
        }))

    async def store_stuff(self, data):
        first_player = await sync_to_async(Player.objects.get)(username=data['winner'])
        first_player_data = await sync_to_async(TicData.objects.get)(player=first_player.id)
        second_player = await sync_to_async(Player.objects.get)(username=data['loser'])
        second_player_data = await sync_to_async(TicData.objects.get)(player=second_player.id)

        first_player_data.wins += 1
        first_player_data.exp_game += 100
        second_player_data.losses += 1
        second_player_data.exp_game += 1

        await sync_to_async(first_player_data.save)()
        await sync_to_async(second_player_data.save)()
        
        match = await sync_to_async(Matches.objects.create)(
            player=first_player,
            opponent=second_player,
            winner=first_player.username,
            loser=second_player.username,
            left_score=data['win_score'],
            right_score=data['lose_score'],
            game_type='XO'
        )
        await sync_to_async(match.save)()

special_queue = []
to_keep_queue = []

class GameInvite(WebsocketConsumer):
    def connect(self):
        #print("XO GAME INVITE: CONNECT");
        self.accept()
        
    def disconnect(self, self_code):
        global special_queue
        if hasattr(self, 'room_name') and self.room_name not in to_keep_queue:
            if self.room_name in special_queue:
                special_queue.remove(self.room_name)
            if self.room_name != 'there is no room for you':
                async_to_sync(self.channel_layer.group_send)(
                        self.room_group_name,
                        {
                            'type': 'send_msg',
                            'message': 'pair disconnected',
                            'room_name': self.room_group_name
                        }
                )
                async_to_sync(self.channel_layer.group_discard)(
                        self.room_group_name,
                        self.channel_name
                )

    def receive(self, text_data):
        data = json.loads(text_data)
        global special_queue
        #print("xo_game.consumer.receive.message: ", data['message'])

        if data['message'] == "register_first" or data['message'] == "register_second":
            self.room_name = f"{data['room_id']}_{data['role']}"
            special_queue.append(self.room_name)
            to_keep_queue.append(self.room_name)
        
        elif data['message'] == "confirm":

            self_room_id = f"{data['room_id']}_{data['role']}"

            if self_room_id in to_keep_queue:
                to_keep_queue.remove(self_room_id)

            if self_room_id in special_queue:
                #print("found in special queue")
                self.room_name = data['room_id']
                self.room_group_name = f"game_{self.room_name}"
                self.role = data['role']
                special_queue.remove(self_room_id)

                async_to_sync(self.channel_layer.group_add)(
                        self.room_group_name,
                        self.channel_name
                    )

                self.send(text_data=json.dumps({
                    'msg_type': 'server update',
                    'role': self.role,
                }))

                if self.role == "guest":
                    async_to_sync(self.channel_layer.group_send)(
                            self.room_group_name,
                            {
                                'type': 'send_msg',
                                'message': 'you just got a pair',
                                'room_name': self.room_group_name,
                            }
                        )
                else:
                    self.send(text_data=json.dumps({
                        'msg_type': 'server update',
                        'role': self.role,
                        'message': 'waiting for your pair',
                        'room_name': self.room_group_name
                    }))
            else:
                self.room_name = 'there is no room for you'
                self.send(text_data=json.dumps({
                    'msg_type': 'server update',
                    'role': 'you got no role',
                    'message': 'fuck off',
                    'room_name': self.room_name
                }))
                self.close()
        elif data['message'] == "unregister":
            self.room_name = data['room_id']
            self.room_group_name = f"game_{self.room_name}"
            self.role = data['role']

            async_to_sync(self.channel_layer.group_add)(
                    self.room_group_name,
                    self.channel_name
                )

            async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'send_msg',
                        'message': 'pair refuse',
                        'room_name': self.room_group_name,
                    }
                )

            self.close()
        elif data['message'] == "result":
            async_to_sync(self.store_stuff)(data)
        else:
            async_to_sync(self.channel_layer.group_send)(
                    self.room_group_name,
                    {
                        'type': 'send_update',
                        'obj': data['obj'],
                        'message': data['message'],
                        'target': data['target']
                    }
            )
            return
        #print("special_queue: ", special_queue)
        #print("to_keep_queue: ", to_keep_queue)

    def send_msg(self, event):
        message = event['message']
        room_name = event['room_name']
        self.send(text_data=json.dumps({
            'msg_type': 'server update',
            'message': message,
            'room_name': room_name,
        }))
    def send_update(self, event):
        message = event['message']
        obj = event['obj']
        target = event['target']
        self.send(text_data=json.dumps({
            'msg_type': 'pair update',
            'message': message,
            'target': target,
            'obj': obj
        }))
    async def store_stuff(self, data):
        first_player = await sync_to_async(Player.objects.get)(username=data['winner'])
        first_player_data = await sync_to_async(TicData.objects.get)(player=first_player.id)
        second_player = await sync_to_async(Player.objects.get)(username=data['loser'])
        second_player_data = await sync_to_async(TicData.objects.get)(player=second_player.id)

        first_player_data.wins += 1
        first_player_data.exp_game += 100
        second_player_data.losses += 1
        second_player_data.exp_game += 1

        await sync_to_async(first_player_data.save)()
        await sync_to_async(second_player_data.save)()
        
        match = await sync_to_async(Matches.objects.create)(
            player=first_player,
            opponent=second_player,
            winner=first_player.username,
            loser=second_player.username,
            left_score=data['win_score'],
            right_score=data['lose_score'],
            game_type='XO'
        )
        await sync_to_async(match.save)()
