import json
import uuid
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from login.models import Player, TicData
import asyncio

players_queue = []

class Game(WebsocketConsumer):
    def connect(self):
        global  players_queue

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
            async_to_sync(self.channel_layer.group_send) (
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
        #print("queue len after connect: ", len(players_queue))


    def disconnect(self, close_code):
        global players_queue
        if self.room_name in players_queue:
            players_queue.remove(self.room_name)
        async_to_sync(self.channel_layer.group_send) (
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
        #print("queue len after disconnect: ", len(players_queue))

    async def receive(self, text_data):
        data = json.loads(text_data)
#        if data['message'] == "player move":
#            print('server: just sent a move')
        
        #print("receive: ", len(players_queue))
        if data['message'] != "result":
            async_to_sync(self.channel_layer.group_send) (
                self.room_group_name,
                {
                    'type': 'send_update',
                    'obj': data['obj'],
                    'message': data['message'],
                    'target': data['target'],
                    }
                )
        elif data['message'] == "result":
            winner = data['winner']
            loser = data['loser']
            win_score = data['win_score']
            lose_score = data['lose_score']

            first_player = await sync_to_async(Player.objects.get)(username=winner)
            first_player_data = await sync_to_async(PingData.objects.get)(player=first_player.id)
            second_player = await sync_to_async(Player.objects.get)(username=loser)
            second_player_data = await sync_to_async(PingData.objects.get)(player=second_player.id)

            first_player_data.wins += 1
            first_player_data.exp_game += 10
            second_player_data.losses += 1
            second_player_data.exp_game += 1

            await sync_to_async(first_player_data.save)()
            await sync_to_async(second_player_data.save)()

            match = await sync_to_async(Matches.objects.create)(
                game_type='XO',
                player=first_player,
                opponent=second_player,
                winner=first_player.username,
                loser=second_player.username,
                left_score=self.left_score,
                right_score=self.right_score
            )
            await sync_to_async(match.save)()

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

    async def receive(self, text_data):
        data = json.loads(text_data)
        global special_queue
        #print("recive.message: ", data['message'])

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
        elif data['message'] == "result":
            winner = data['winner']
            loser = data['loser']
            win_score = data['win_score']
            lose_score = data['lose_score']

            first_player = await sync_to_async(Player.objects.get)(username=winner)
            first_player_data = await sync_to_async(PingData.objects.get)(player=first_player.id)
            second_player = await sync_to_async(Player.objects.get)(username=loser)
            second_player_data = await sync_to_async(PingData.objects.get)(player=second_player.id)

            first_player_data.wins += 1
            first_player_data.exp_game += 10
            second_player_data.losses += 1
            second_player_data.exp_game += 1

            await sync_to_async(first_player_data.save)()
            await sync_to_async(second_player_data.save)()

            match = await sync_to_async(Matches.objects.create)(
                game_type='XO',
                player=first_player,
                opponent=second_player,
                winner=first_player.username,
                loser=second_player.username,
                left_score=self.left_score,
                right_score=self.right_score
            )
            await sync_to_async(match.save)()

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
