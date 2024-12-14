import json
import time
import random
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import asyncio
from channels.layers import get_channel_layer
from login.models import Player, PingData
from matches.models import Matches
from django.utils import timezone
from channels.layers import get_channel_layer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
channel_layer = get_channel_layer()

class GameStateManager:
    _game_states = {}

    @classmethod
    def get_state(cls, room_name):
        return cls._game_states.get(room_name, None)

    @classmethod
    def set_state(cls, room_name, game_state):
        cls._game_states[room_name] = game_state

    @classmethod
    def remove_state(cls, room_name):
        if room_name in cls._game_states:
            del cls._game_states[room_name]

class GameConsumer(AsyncWebsocketConsumer):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated] 
    name = ''
    avatar = ''
    room_group_name = ''
    ingame = False
    admin = None
    game = {}
    queue = {}
    instances = {}
    game_loop = False 
    game_width = 800
    game_height = 500
    right_paddleY = 0
    left_paddleY = 0
    ballx = 400
    bally = 250
    balldirectionX = 1
    balldirectionY = 1
    racketHeight = (game_height * 20 / 100)
    racketWidth = (game_width * 2.5 / 100) 
    baddle_speed = 10
    ball_radius = 15
    right_score = 0
    left_score = 0
    bonus = 0
    ball_speed = 800 / (2 * 60) + bonus


    async def connect(self):
        await self.accept()
        
    async def disconnect(self, close_code):
        if self.ingame:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_message',
                    'message': 'disconnected',
                }
            )
            self.admin.game_loop = False
            GameStateManager.remove_state(self.room_group_name)
        if self.name in GameConsumer.queue:
            del GameConsumer.queue[self.name]

    async def receive(self, text_data):
        print('Received:', text_data)
        if not text_data.strip():
            print('Received empty message')
            return
        
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            print('Received malformed JSON')
            return

        action = data.get('action')
        value = data.get('value', 0)

        if action == 'connect':
            if (data.get('username') in GameConsumer.queue):
                self.close()
            GameConsumer.queue[data.get('username')] = {
                'username': data.get('username'),
                'level': data.get('level'),
                'avatar': data.get('avatar'),
                'channel_name': self.channel_name,
                'group_name': ''
            }
            self.name = data.get('username')
            self.avatar = data.get('avatar')
            GameConsumer.instances[self.name] = self

            print("len:", len(GameConsumer.queue)), "username:", data.get('username'), "avatar:", data.get('avatar'); 
            if len(GameConsumer.queue) >= 2:
                match_found = False
                matched_players = []
                players_list = list(GameConsumer.queue.items())
                
                for i, (player1, data1) in enumerate(players_list):
                    for j, (player2, data2) in enumerate(players_list):
                        if i != j:
                            if abs((data1['level'] / 100) - (data2['level']) / 100) <= 5:
                                match_found = True
                                matched_players = [player1, player2]
                                break
                    if match_found:
                        break
                if match_found:
                    self.ingame = True
                    self.admin = self

                    group_name = f'game{matched_players[0]}vs{matched_players[1]}'
                    print("group_name=",group_name)
                    game_state = {
                        'ballx': 400,
                        'bally': 250,
                        'left_paddle_y': 0,
                        'right_paddle_y': 0,
                        'left_score': 0,
                        'right_score': 0,
                        'left_player': GameConsumer.queue[matched_players[0]]['username'],
                        'right_player': GameConsumer.queue[matched_players[1]]['username']
                    }
                    GameStateManager.set_state(group_name, game_state)

                    self.game[matched_players[0]] = {
                        'username': GameConsumer.queue[matched_players[0]]['username'],
                        'avatar': GameConsumer.queue[matched_players[0]]['avatar'],
                        'level': GameConsumer.queue[matched_players[0]]['level'],
                        'player_id': 1,
                    }
                    self.game[matched_players[1]] = {
                        'username': GameConsumer.queue[matched_players[1]]['username'],
                        'avatar': GameConsumer.queue[matched_players[1]]['avatar'],
                        'level': GameConsumer.queue[matched_players[1]]['level'],
                        'player_id': 2,
                    }
                    if (self.name == matched_players[0]):
                        myenemy = matched_players[1]
                    else:
                        myenemy = matched_players[0]
                    if myenemy in GameConsumer.instances:
                        GameConsumer.instances[myenemy].game = self.game
                        GameConsumer.instances[myenemy].ingame = True
                        GameConsumer.instances[myenemy].room_group_name = group_name
                        GameConsumer.instances[myenemy].admin = self

                    await self.channel_layer.group_add(
                        group_name,
                        GameConsumer.queue[matched_players[0]]['channel_name']
                    )
                    await self.channel_layer.group_add(
                        group_name,
                        GameConsumer.queue[matched_players[1]]['channel_name']
                    )
                    self.room_group_name = group_name
                    data = {
                        'message': 'game_started',
                        'player_id1': matched_players[0],
                        'player_1_avatar': self.game[matched_players[0]]['avatar'],
                        'player_id2': matched_players[1],
                        'player_2_avatar': self.game[matched_players[1]]['avatar'],
                        'group_name': group_name,
                    }
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'game_data',
                            'message': data
                        }
                    )
                    self.game_loop = True
                    asyncio.create_task(self.run_60_times_per_second())

                    for player in matched_players:
                        del GameConsumer.queue[player]

        if self.ingame:
            if action == 'ArrowDown':
                if self.admin.right_paddleY <= self.admin.game_height - self.admin.racketHeight - 10:
                    self.admin.right_paddleY += value
            elif action == 'ArrowUp':
                if self.admin.right_paddleY >= 10:
                    self.admin.right_paddleY -= value
            if action == 's':
                if self.admin.left_paddleY <= self.admin.game_height - self.admin.racketHeight - 10:
                    self.admin.left_paddleY += value
            elif action == 'w':
                if self.admin.left_paddleY >= 10:
                    self.admin.left_paddleY -= value

    async def pack_data_to_send(self):
        data = {
            'message': 'game_data',
            'ballx': self.ballx,
            'bally': self.bally,
            'right_paddleY': self.right_paddleY,
            'left_paddleY': self.left_paddleY,
            'right_score': self.right_score,
            'left_score': self.left_score,
            'game_width': self.game_width,
            'game_height': self.game_height,
            'ball_radius': 15,
        }


        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_data',
                'message': data
            }
        )
        packet = {
            'message': 'game_data',
            'ballx': self.ballx,
            'bally': self.bally,
            'right_paddleY': self.right_paddleY,
            'left_paddleY': self.left_paddleY,
            'right_score': self.right_score,
            'left_score': self.left_score,
            'game_width': self.game_width,
            'game_height': self.game_height,
        }
        GameStateManager.set_state(self.room_group_name, packet)
    
    async def game_data(self, event):
        data = event['message']
        await self.send(text_data=json.dumps(data))

    async def game_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def run_60_times_per_second(self):
        while self.game_loop:
            await self.gamelogic()
            await asyncio.sleep(1/60)
    
    async def gamelogic(self):
        self.ballx += (self.ball_speed + self.bonus) * self.balldirectionX
        self.bally += (self.ball_speed + self.bonus) * self.balldirectionY

        if (self.ballx + 15 >= self.game_width - self.racketWidth and
            self.right_paddleY <= (self.bally + 15) and
            self.right_paddleY + self.racketHeight >= (self.bally - 15)):

            offset = (self.bally - (self.right_paddleY + self.racketHeight / 2)) / (self.racketHeight / 2)
            if (offset > 0 and offset > 10):
                offset = 5
            elif (offset < 0 and offset < -10):
                offset = -5
            self.ballx = self.game_width - self.racketWidth - 16
            self.balldirectionX *= -1
            self.balldirectionY = offset
            self.bonus += 1

        elif (self.ballx - 15 <= self.racketWidth and
            self.left_paddleY <= (self.bally + 15) and
            self.left_paddleY + self.racketHeight >= (self.bally - 15)):

            offset = (self.bally - (self.left_paddleY + self.racketHeight / 2)) / (self.racketHeight / 2)
            if (offset > 0 and offset > 10):
                offset = 5
            elif (offset < 0 and offset < -10):
                offset = -5
            self.ballx = self.racketWidth + 16
            self.balldirectionX *= -1
            self.balldirectionY = offset
            self.bonus += 1

        elif self.bally - 15 <= 0:
            self.bally = 16
            self.balldirectionY *= -1
        
        elif self.bally + 15 >= self.game_height:
            self.bally = self.game_height - 16
            self.balldirectionY *= -1
        
        elif self.ballx <= 15:
            self.ballx = 400
            self.bally = 250
            self.balldirectionX = -1  
            self.balldirectionY = random.uniform(-1, 1)
            self.right_score += 1
            self.bonus = 0
            if (self.right_score >= 5000):
                self.game_loop = False
                data = {
                    'winner': '2',
                    'left_score': self.left_score,
                    'loser': '1',
                    'right_score': self.right_score
                }
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_data',
                        'message': data
                    }
                )

                GameStateManager.remove_state(self.room_group_name)

                values = list(self.game.values())

                first_element = values[0]
                second_element = values[1]

                first_player = await sync_to_async(Player.objects.get)(username=first_element['username'])
                first_player_data = await sync_to_async(PingData.objects.get)(player=first_player.id)
                second_player = await sync_to_async(Player.objects.get)(username=second_element['username'])
                second_player_data = await sync_to_async(PingData.objects.get)(player=second_player.id)

                first_player_data.losses += 1
                first_player_data.exp_game += 1
                second_player_data.wins += 1
                second_player_data.exp_game += 10

                await sync_to_async(first_player_data.save)()
                await sync_to_async(second_player_data.save)()

                match = await sync_to_async(Matches.objects.create)(
                    game_type='Pong',
                    player=first_player,
                    opponent=second_player,
                    winner=second_player.username,
                    winner_profile_name=second_player.profile_name,
                    loser_profile_name=first_player.profile_name,
                    winner_avatar=second_player.avatar,
                    loser_avatar=first_player.avatar,
                    loser=first_player.username,
                    left_score=self.left_score,
                    right_score=self.right_score
                )
                await sync_to_async(match.save)()


        elif self.ballx >= self.game_width - 15:
            self.ballx = 400
            self.bally = 250
            self.balldirectionX = 1
            self.balldirectionY = random.uniform(-1, 1)
            self.left_score += 1
            self.bonus = 0
            if (self.left_score >= 5000):
                self.game_loop = False
                data = {
                    'winner': '1',
                    'left_score': self.left_score,
                    'loser': '2',
                    'right_score': self.right_score
                }
                await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_data',
                    'message': data
                })

                GameStateManager.remove_state(self.room_group_name)

                values = list(self.game.values())

                first_element = values[0]
                second_element = values[1]
                
                first_player = await sync_to_async(Player.objects.get)(username=first_element['username'])
                first_player_data = await sync_to_async(PingData.objects.get)(player=first_player.id)
                second_player = await sync_to_async(Player.objects.get)(username=second_element['username'])
                second_player_data = await sync_to_async(PingData.objects.get)(player=second_player.id)

                first_player_data.wins += 1
                first_player_data.exp_game += 10
                second_player_data.losses += 1
                second_player_data.exp_game += 1

                await sync_to_async(first_player_data.save)()
                await sync_to_async(second_player_data.save)()

                match = await sync_to_async(Matches.objects.create)(
                    game_type='Pong',
                    player=first_player,
                    opponent=second_player,
                    winner=first_player.username,
                    loser=second_player.username,
                    winner_profile_name=first_player.profile_name,
                    loser_profile_name=second_player.profile_name,
                    winner_avatar=first_player.avatar,
                    loser_avatar=second_player.avatar,
                    left_score=self.left_score,
                    right_score=self.right_score
                )
                await sync_to_async(match.save)()
        await self.pack_data_to_send()


class inviteConsumer(AsyncWebsocketConsumer):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    game_queue = {}
    room_group_name = ''
    name = ''
    admin = None
    ingame = False
    inqueue = False
    game_loop = False
    game_width = 800
    game_height = 500
    right_paddleY = 0
    left_paddleY = 0
    ballx = 400
    bally = 250
    balldirectionX = 1
    balldirectionY = 1
    racketHeight = (game_height * 20 / 100)
    racketWidth = (game_width * 2.5 / 100)
    baddle_speed = 10
    ball_radius = 15
    right_score = 0
    left_score = 0
    bonus = 0
    ball_speed = 800 / (2 * 60) + bonus

    async def connect(self):
        await self.accept()
        print('Connected')

    async def disconnect(self, close_code):
        print('Disconnected')
        if self.ingame: 
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_message',
                    'message': 'disconnected',
                }
            )
            self.game_loop = False
            self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name
                )
        # print('game_id:', self.room_group_name, 'in_queue:', self.inqueue)
        if self.inqueue:
            if inviteConsumer.game_queue.get(self.room_group_name) is not None:
                print('kherj fi 7alatek')
                del inviteConsumer.game_queue[self.room_group_name]

    async def receive(self, text_data):
        if not text_data.strip():
            print('Received empty message')
            return
        
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            print('Received malformed JSON')
            return

        action = data.get('action')
        # value = data.get('value')
        
        #this case for invite friend to play
        print('we received something:', data)
        if action == 'friend_game':
            game_key = data.get('game_id')
            print(f"Game key: {game_key}")
            inviteConsumer.game_queue[game_key] = {
                'player1':  {
                    'username': data.get('player1'),
                    'channel_name': None,
                    'avatar1': data.get('avatar1'),
                    'instance': None,
                },
                'player2': {
                    'username': data.get('player2'),
                    'channel_name': None,
                    'avatar2': data.get('avatar2'),
                    'instance': None,
                },
                'counter': 30,
                'connected': 0,
            }
            # Start the countdown in a separate thread
            asyncio.create_task(self.start_countdown(game_key))
            return

        #this case if a player join the (invite friend game)
        elif action == 'connect':
            print('a user has connected')
            username = data.get('username')
            if len(inviteConsumer.game_queue) > 0:
                print('game queue is not empty')
                game_id = data.get('game_id')
                # print('game_id:', game_id)
                game = inviteConsumer.game_queue[game_id]
                if game is not None:
                    game['connected'] += 1
                    if game['player1']['username'] == username:
                        game['player1']['channel_name'] = self.channel_name
                        game['player1']['instance'] = self
                    elif game['player2']['username'] == username:
                        game['player2']['channel_name'] = self.channel_name
                        game['player2']['instance'] = self
                    self.inqueue = True
                    self.room_group_name = game_id
                    print(f"Player {username} joined game")
                    if (game['connected'] == 2):
                        game['player1']['instance'].ingame = True
                        game['player2']['instance'].ingame = True
                        game['player1']['instance'].admin = self
                        game['player2']['instance'].admin = self
                        game['player1']['instance'].inqueue = False
                        game['player2']['instance'].inqueue = False
                        game_state = {
                            'ballx': 400,
                            'bally': 250,
                            'left_paddle_y': 0,
                            'right_paddle_y': 0,
                            'left_score': 0,
                            'right_score': 0,
                            'left_player': game['player1']['username'],
                            'right_player': game['player2']['username']
                        }
                        GameStateManager.set_state(game_id, game_state)

                        await self.channel_layer.group_add(
                            self.room_group_name,
                            game['player1']['channel_name']
                        )
                        await self.channel_layer.group_add(
                            self.room_group_name,
                            game['player2']['channel_name']
                        )
                        data = {
                            'message': 'game_started',
                            'player_id1': game['player1']['username'],
                            'player_1_avatar': game['player1']['avatar1'],
                            'player_id2': game['player2']['username'],
                            'player_2_avatar': game['player2']['avatar2'],
                        }
                        await self.channel_layer.group_send(
                            self.room_group_name,
                            {
                                'type': 'game_data',
                                'message': data
                            }
                        )
                        self.game_loop = True
                        del inviteConsumer.game_queue[game_id]
                        asyncio.create_task(self.run_60_times_per_second())
                else:
                    print('the user who join is not in any of the friend games')

                    message = "Leave"
                    await self.send(text_data=json.dumps({'message': message}))
            else:
                print('game queue is empty')
                message = "Leave"
                await self.send(text_data=json.dumps({'message': message}))
        elif action == 'decline':
            game_id = data.get('game_id')
            game = inviteConsumer.game_queue[game_id]
            if game is not None:
                if game['player1']['instance'] is not None:
                    print('player1 instance is not none')
                    player1 = game['player1']['instance']
                    print('user in queue:', player1.inqueue)
                    await player1.send(text_data=json.dumps({'message': 'Leave'}))
                    # del inviteConsumer.game_queue[game_id]

        if self.ingame:
            if action == 'ArrowDown':
                if self.admin.right_paddleY <= self.admin.game_height - self.admin.racketHeight - 10:
                    self.admin.right_paddleY += 10
            elif action == 'ArrowUp':
                if self.admin.right_paddleY >= 10:
                    self.admin.right_paddleY -= 10

            if action == 's':
                if self.admin.left_paddleY <= self.admin.game_height - self.admin.racketHeight - 10:
                    self.admin.left_paddleY += 10
            elif action == 'w':
                if self.admin.left_paddleY >= 10:
                    self.admin.left_paddleY -= 10

    async def run_60_times_per_second(self):
        while self.game_loop:
            # start_time = time.time()
            await self.gamelogic()
            # end_time = time.time()
            # execution_time = end_time - start_time
            # print(f"gamelogic() execution time: {execution_time:.6f} seconds")
            await asyncio.sleep(1/60)

    async def pack_data_to_send(self):
        data = {
            'message': 'game_data',
            'ballx': self.ballx,
            'bally': self.bally,
            'right_paddleY': self.right_paddleY,
            'left_paddleY': self.left_paddleY,
            'right_score': self.right_score,
            'left_score': self.left_score,
            'game_width': self.game_width,
            'game_height': self.game_height,
            'ball_radius': 15,
        }
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_data',
                'message': data
            }
        )
        packet = {
            'message': 'game_data',
            'ballx': self.ballx,
            'bally': self.bally,
            'right_paddleY': self.right_paddleY,
            'left_paddleY': self.left_paddleY,
            'right_score': self.right_score,
            'left_score': self.left_score,
            'game_width': self.game_width,
            'game_height': self.game_height,
        }
        GameStateManager.set_state(self.room_group_name, packet)
    
    async def game_data(self, event):
        data = event['message']
        await self.send(text_data=json.dumps(data))

    async def game_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def start_countdown(self, game_id):
        print(f"Starting countdown for game {game_id}")
        while game_id in inviteConsumer.game_queue:
            game = inviteConsumer.game_queue.get(game_id)
            if game is None or game['counter'] <= 0:
                print(f"Game {game_id} expired, removing from the queue.")
                player1 = inviteConsumer.game_queue[game_id]['player1']['instance']
                await player1.send(text_data=json.dumps({'message': 'Leave'}))
                inviteConsumer.game_queue.pop(game_id, None)
                break

            # Sleep for 1 second and decrease the counter
            print(f"Game {game_id} counter: {game['counter']}")
            await asyncio.sleep(1)
            if game_id in inviteConsumer.game_queue:
                inviteConsumer.game_queue[game_id]['counter'] -= 1
        if game_id not in inviteConsumer.game_queue:
            print("game has started")
    
    async def run_60_times_per_second(self):
        while self.game_loop:
            await self.gamelogic()
            await asyncio.sleep(1/60)

    async def gamelogic(self):
        self.ballx += (self.ball_speed + self.bonus) * self.balldirectionX
        self.bally += (self.ball_speed + self.bonus) * self.balldirectionY

        if (self.ballx + 15 >= self.game_width - self.racketWidth and
            self.right_paddleY <= (self.bally + 15) and
            self.right_paddleY + self.racketHeight >= (self.bally - 15)):

            offset = (self.bally - (self.right_paddleY + self.racketHeight / 2)) / (self.racketHeight / 2)
            if (offset > 0 and offset > 10):
                offset = 10
            elif (offset < 0 and offset < -10):
                offset = -10
            self.ballx = self.game_width - self.racketWidth - 16
            self.balldirectionX *= -1
            self.balldirectionY = offset
            self.bonus += 1

        elif (self.ballx - 15 <= self.racketWidth and
            self.left_paddleY <= (self.bally + 15) and
            self.left_paddleY + self.racketHeight >= (self.bally - 15)):

            offset = (self.bally - (self.left_paddleY + self.racketHeight / 2)) / (self.racketHeight / 2)
            if (offset > 0 and offset > 10):
                offset = 10
            elif (offset < 0 and offset < -10):
                offset = -10
            self.ballx = self.racketWidth + 16
            self.balldirectionX *= -1
            self.balldirectionY = offset
            self.bonus += 1

        elif self.bally - 15 <= 0:
            self.bally = 16
            self.balldirectionY *= -1
        
        elif self.bally + 15 >= self.game_height:
            self.bally = self.game_height - 16
            self.balldirectionY *= -1
        
        elif self.ballx <= 15:
            self.ballx = 400
            self.bally = 250
            self.balldirectionX = -1  
            self.balldirectionY = random.uniform(-1, 1)
            self.right_score += 1
            self.bonus = 0
            if (self.right_score >= 5):
                self.game_loop = False
                data = {
                    'winner': '2',
                    'left_score': self.left_score,
                    'loser': '1',
                    'right_score': self.right_score
                }
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'game_data',
                        'message': data
                    }
                )

                GameStateManager.remove_state(self.room_group_name)

        elif self.ballx >= self.game_width - 15:
            self.ballx = 400
            self.bally = 250
            self.balldirectionX = 1
            self.balldirectionY = random.uniform(-1, 1)
            self.left_score += 1
            self.bonus = 0
            if (self.left_score >= 5):
                self.game_loop = False
                data = {
                    'winner': '1',
                    'left_score': self.left_score,
                    'loser': '2',
                    'right_score': self.right_score
                }
                await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_data',
                    'message': data
                })

                GameStateManager.remove_state(self.room_group_name)
        await self.pack_data_to_send()
        

class TournamentConsumer(AsyncWebsocketConsumer):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    tournaments = {}
    game = {}

    name = ''
    ingame = False
    admin = None
    game_loop = False
    game_width = 800
    game_height = 500
    right_paddleY = 0
    left_paddleY = 0
    ballx = 400
    bally = 250
    balldirectionX = 1
    balldirectionY = 1
    racketHeight = (game_height * 20 / 100)
    racketWidth = (game_width * 2.5 / 100)
    baddle_speed = 10
    ball_radius = 15
    right_score = 0
    left_score = 0
    bonus = 0
    ball_speed = 800 / (2 * 60) + bonus
    room_group_name = ''
    async def connect(self):
        await self.accept()
        
    async def disconnect(self, close_code):
        # print(f"disconnect, it could be {self.name}")
        if self.name in TournamentConsumer.tournaments:
            del TournamentConsumer.tournaments[self.name]
        else:
            for tournament in TournamentConsumer.tournaments.values():
                if self.name in tournament.values():
                    tournament['players'] -= 1
                    if tournament['player1_name'] == self.name:
                        tournament['player1_name'] = None
                        tournament['player1_instance'] = None
                    elif tournament['player2_name'] == self.name:
                        tournament['player2_name'] = None
                        tournament['player2_instance'] = None
                    elif tournament['player3_name'] == self.name:
                        tournament['player3_name'] = None
                        tournament['player3_instance'] = None
                    elif tournament['player4_name'] == self.name:
                        tournament['player4_name'] = None
                        tournament['player4_instance'] = None
        data = {
            'message': 'tournament_page',
            'data': list(TournamentConsumer.tournaments.values()) 
        }
        await self.channel_layer.group_send(
        "tournament",
        {
            'type': 'tournament_message',
            'message': data,
        })

    async def remove_all_from_group(self, group_name):
        channel_layer = get_channel_layer()
        # Fetch channels from your custom storage or tracking
        channels = await get_channels_in_group(group_name)  # Implement this method
        for channel_name in channels:
            await channel_layer.group_discard(group_name, channel_name)

    async def receive(self, text_data):
        if not text_data.strip():
            print('Received empty message')
            return
        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            print('Received malformed JSON')
            return

        print('received:', data)
        action = data.get('action')
        if self.ingame:
            print("yes im in game")
            if action == 'ArrowDown':
                print("arrow down")
                if self.admin.right_paddleY <= self.admin.game_height - self.admin.racketHeight - 10:
                    self.admin.right_paddleY += 10
            elif action == 'ArrowUp':
                print("arrow up")
                if self.admin.right_paddleY >= 10:
                    self.admin.right_paddleY -= 10
            if action == 's':
                print("s")
                if self.admin.left_paddleY <= self.admin.game_height - self.admin.racketHeight - 10:
                    self.admin.left_paddleY += 10
            elif action == 'w':
                print("w")
                if self.admin.left_paddleY >= 10:
                    self.admin.left_paddleY -= 10
        else:
            print("im not in the game", self.name)

        if action == 'fetch_tournaments':
            print("we are inside fetch_tournaments")
            self.name = data.get('name')
            await self.channel_layer.group_add(
                "tournament",
                self.channel_name
            )
            data = {
                'message': 'tournament_page',
                'data': list(TournamentConsumer.tournaments.values()) 
            }
            await self.channel_layer.group_send(
            "tournament",
            {
                'type': 'tournament_message',
                'message': data,
                
            })
        elif action == 'connected':
            print("we are inside connected")
            tournament_name = data.get('room')
            await self.channel_layer.group_add(
                tournament_name,
                self.channel_name
            )
        elif action == 'update_alias':
            print("we are inside update_alias")
            tournament_name = data.get('room')
            if tournament_name in TournamentConsumer.game:
                print("tournament exists")
                tournament = TournamentConsumer.game[tournament_name]
                if tournament['connected'] < 4 and data.get('name') in [tournament.get(f'player{i}_name') for i in range(1, 5)]:
                    print("u are in player list")
                    aliasname = data.get('aliasname')
                    avatar = data.get('avatar')
                    name = data.get('name')
                    if aliasname in [tournament.get(f'player{i}_alias') for i in range(1, 5)]:
                        print(f"user alias exists {aliasname}")
                        message = "alias_exists"
                        await self.send(text_data=json.dumps({'message': message}))
                        return
                    print("tournament", tournament)
                    if tournament['player1_name'] == name:
                        tournament['player1_alias'] = aliasname
                        tournament['player1_avatar'] = avatar
                        tournament['connected'] += 1
                        tournament['player1_instance'] = self
                        await self.channel_layer.group_add(
                            tournament['group1'],
                            self.channel_name
                        )
                    elif tournament['player2_name'] == name:
                        tournament['player2_alias'] = aliasname
                        tournament['player2_avatar'] = avatar
                        tournament['connected'] += 1
                        tournament['player2_instance'] = self
                        await self.channel_layer.group_add(
                            tournament['group1'],
                            self.channel_name
                        )
                    elif tournament['player3_name'] == name:
                        tournament['player3_alias'] = aliasname
                        tournament['player3_avatar'] = avatar
                        tournament['connected'] += 1
                        tournament['player3_instance'] = self
                        await self.channel_layer.group_add(
                            tournament['group2'],
                            self.channel_name
                        )
                    elif tournament['player4_name'] == name:
                        tournament['player4_alias'] = aliasname
                        tournament['player4_avatar'] = avatar
                        tournament['connected'] += 1
                        tournament['player4_instance'] = self
                        await self.channel_layer.group_add(
                            tournament['group2'],
                            self.channel_name
                        )
                    data = {
                        'message': 'update_players',
                        'player1_alias': tournament['player1_alias'],
                        'player1_avatar': tournament['player1_avatar'],
                        'player2_alias': tournament['player2_alias'],
                        'player2_avatar': tournament['player2_avatar'],
                        'player3_alias': tournament['player3_alias'],
                        'player3_avatar': tournament['player3_avatar'],
                        'player4_alias': tournament['player4_alias'],
                        'player4_avatar': tournament['player4_avatar'],
                    }
                    await self.channel_layer.group_send(
                    tournament_name,
                    {
                        'type': 'tournament_message',
                        'message': data,
                    })
                    if tournament['connected'] == 4:
                        data = {
                            'message': 'tournament_started',
                        }
                        await self.channel_layer.group_send(
                        tournament_name,
                        {
                            'type': 'tournament_message',
                            'message': data,
                        })
        elif action == 'startmygame':
            print("we are inside startmygame")
            tournament_name = data.get('room')
            if tournament_name in TournamentConsumer.game:
                print("tournament exists")
                tournament = TournamentConsumer.game[tournament_name]
                print("the user with alias:", data.get('aliasname'), "wants to start his game")
                if data.get('aliasname') == tournament['player1_alias']:
                    print("player:", tournament['player1_name'], "joined and will host his match") 
                    self.game_loop = True
                    self.ingame = True
                    self.admin = tournament['player1_instance']
                    data = {
                            'message': 'game_started',
                            'player_id1': tournament['player1_alias'],
                            'player1_avatar': tournament['player1_avatar'],
                            'player_id2': tournament['player2_alias'],
                            'player2_avatar': tournament['player2_avatar'],
                    }
                    await self.channel_layer.group_send(
                    tournament['group1'],
                    {
                        'type': 'tournament_message',
                        'message': data,
                    })
                    asyncio.create_task(self.run_60_times_per_second(tournament, 'game1'))
                elif data.get('aliasname') == tournament['player2_alias']:
                    self.ingame = True
                    self.admin = tournament['player1_instance']
                elif data.get('aliasname') == tournament['player3_alias']:
                    print("player:", tournament['player3_name'], "joined and will host his match") 
                    self.ingame = True
                    self.game_loop = True
                    self.admin = tournament['player3_instance']
                    data = {
                            'message': 'game_started',
                            'player_id1': tournament['player3_alias'],
                            'player1_avatar': tournament['player3_avatar'],
                            'player_id2': tournament['player4_alias'],
                            'player2_avatar': tournament['player4_avatar'],
                    }
                    await self.channel_layer.group_send(
                    tournament['group2'],
                    {
                        'type': 'tournament_message',
                        'message': data,
                    })
                    asyncio.create_task(self.run_60_times_per_second(tournament, 'game2'))
                elif data.get('aliasname') == tournament['player4_alias']:
                    self.ingame = True
                    self.admin = tournament['player3_instance']
        elif action == 'create_tournament':
            print("we are inside create_tournament")
            key = data.get('name')
            if key in TournamentConsumer.tournaments:
                print("tournament already exists")
                return
            print("key in create:", key)
            TournamentConsumer.tournaments[key] = {
                'name': key,
                'players': 0,
                'player1_name': None,
                'player2_name': None,
                'player3_name': None,
                'player4_name': None,
            }
            data = {
                'message': 'tournament_created',
                'tournament': TournamentConsumer.tournaments,
            }
            await self.channel_layer.group_send(
            "tournament",
            {
                'type': 'tournament_message',
                'message': data,
            })
            print("we did everything")
        elif action == 'join_tournament':
            tournament_name = data.get('target')
            if tournament_name in TournamentConsumer.tournaments:
                print("tournament exists")
                tournament = TournamentConsumer.tournaments[tournament_name]
                if tournament['players'] < 4 and data.get('name') not in [tournament.get(f'player{i}_name') for i in range(1, 5)]:
                    print("player can join")
                    tournament['players'] += 1
                    name = data.get('name')
                    if tournament['player1_name'] is None:
                        tournament['player1_name'] = name
                    elif tournament['player2_name'] is None:
                        tournament['player2_name'] = name
                    elif tournament['player3_name'] is None:
                        tournament['player3_name'] = name
                    elif tournament['player4_name'] is None:
                        tournament['player4_name'] = name

                    await self.channel_layer.group_add(
                        tournament_name,
                        self.channel_name
                    )
                    data = {
                        'message': 'join_tournament',
                        'tournament': TournamentConsumer.tournaments
                    }
                    await self.channel_layer.group_send(
                    "tournament",
                    {
                        'type': 'tournament_message',
                        'message': data,
                    })
                    #now i will check if the tournament should start
                    if tournament['players'] == 4:
                        data = {
                            'message': 'tournament_about_to_start',
                            'RoomName': tournament_name,
                        }
                        # asyncio.create_task(self.start_countdown(tournament_name)) we will need to start the countdown
                        TournamentConsumer.game[tournament_name] = {
                            'connected': 0,
                            'player1_name': tournament['player1_name'],
                            'player1_alias': 'Unknown',
                            'player1_avatar': '/assets/unknown.png',
                            'player2_name': tournament['player2_name'],
                            'player2_alias': 'Unknown',
                            'player2_avatar': '/assets/unknown.png',
                            'player3_name': tournament['player3_name'],
                            'player3_alias': 'Unknown',
                            'player3_avatar': '/assets/unknown.png',
                            'player4_name': tournament['player4_name'],
                            'player4_alias': 'Unknown',
                            'player4_avatar': '/assets/unknown.png',
                            'group1': f"{tournament['player1_name']}vs{tournament['player2_name']}",
                            'group2': f"{tournament['player3_name']}vs{tournament['player4_name']}",
                            'group3': None,
                        }
                        await self.channel_layer.group_send(
                        tournament_name,
                        {
                            'type': 'tournament_message',
                            'message': data,
                        })
        elif action == 'leave_tournament':
            print("im inside leave tournament")
            tournament_name = data.get('target')
            if tournament_name in TournamentConsumer.tournaments:
                print("tournament exists")
                tournament = TournamentConsumer.tournaments[tournament_name]
                if data.get('name') in [tournament.get(f'player{i}_name') for i in range(1, 5)]:
                    print("player can join")
                    tournament['players'] -= 1
                    name = data.get('name')
                    if tournament['player1_name'] == name:
                        tournament['player1_name'] = None
                    elif tournament['player2_name'] == name:
                        tournament['player2_name'] = None
                    elif tournament['player3_name'] == name:
                        tournament['player3_name'] = None
                    elif tournament['player4_name'] == name:
                        tournament['player4_name'] = None
                    self.channel_layer.group_discard(
                        tournament_name,
                        self.channel_name,
                    )
                    data = {
                        'message': 'leave_tournament',
                        'tournament': TournamentConsumer.tournaments
                    }
                    await self.channel_layer.group_send(
                    "tournament",
                    {
                        'type': 'tournament_message',
                        'message': data,
                    })
        elif action == 'cancel_tournament':
            tournament_name = data.get('target')
            if tournament_name in TournamentConsumer.tournaments:
                print("tournament exists")
                tournament = TournamentConsumer.tournaments[tournament_name]
                if tournament['players'] < 4 and tournament_name == data.get('name'):
                    print("creater can cancel the match")
                    del TournamentConsumer.tournaments[self.name]
                    data = {
                        'message': 'cancel_tournament',
                        'tournament': TournamentConsumer.tournaments
                    }
                    self.remove_all_from_group(tournament_name)
                    await self.channel_layer.group_send(
                    "tournament",
                    {
                        'type': 'tournament_message',
                        'message': data,
                    })
                    print("we did everything")

    async def tournament_message(self, event):
        data = event['message']
        await self.send(text_data=json.dumps(data))

    async def game_data(self, event):
        data = event['message']
        await self.send(text_data=json.dumps(data))

    async def run_60_times_per_second(self, tournament, game):
        while self.game_loop:
            await self.gamelogic(tournament, game)
            await asyncio.sleep(1/60)

    async def gamelogic(self, tournament, game):
        self.ballx += (self.ball_speed + self.bonus) * self.balldirectionX
        self.bally += (self.ball_speed + self.bonus) * self.balldirectionY

        if (self.ballx + 15 >= self.game_width - self.racketWidth and
            self.right_paddleY <= (self.bally + 15) and
            self.right_paddleY + self.racketHeight >= (self.bally - 15)):

            offset = (self.bally - (self.right_paddleY + self.racketHeight / 2)) / (self.racketHeight / 2)
            if (offset > 0 and offset > 10):
                offset = 5
            elif (offset < 0 and offset < -10):
                offset = -5
            self.ballx = self.game_width - self.racketWidth - 16
            self.balldirectionX *= -1
            self.balldirectionY = offset
            self.bonus += 1

        elif (self.ballx - 15 <= self.racketWidth and
            self.left_paddleY <= (self.bally + 15) and
            self.left_paddleY + self.racketHeight >= (self.bally - 15)):

            offset = (self.bally - (self.left_paddleY + self.racketHeight / 2)) / (self.racketHeight / 2)
            if (offset > 0 and offset > 10):
                offset = 5
            elif (offset < 0 and offset < -10):
                offset = -5
            self.ballx = self.racketWidth + 16
            self.balldirectionX *= -1
            self.balldirectionY = offset
            self.bonus += 1

        elif self.bally - 15 <= 0:
            self.bally = 16
            self.balldirectionY *= -1
        
        elif self.bally + 15 >= self.game_height:
            self.bally = self.game_height - 16
            self.balldirectionY *= -1
        
        elif self.ballx <= 15:
            self.ballx = 400
            self.bally = 250
            self.balldirectionX = -1  
            self.balldirectionY = random.uniform(-1, 1)
            self.right_score += 1
            self.bonus = 0
            if (self.right_score >= 8):
                self.game_loop = False
                if game == 'game1':
                    data = {
                        'message': 'match_result',
                        'winner': tournament['player2_alias'],
                        'left_score': self.left_score,
                        'loser': tournament['player1_alias'],
                        'right_score': self.right_score
                    }
                    await self.channel_layer.group_send(
                        tournament['group1'],
                        {
                            'type': 'game_data',
                            'message': data
                        }
                    )
                elif game == 'game2':
                    data = {
                        'message': 'match_result',
                        'winner': tournament['player4_alias'],
                        'left_score': self.left_score,
                        'loser': tournament['player3_alias'],
                        'right_score': self.right_score
                    }
                    await self.channel_layer.group_send(
                        tournament['group2'],
                        {
                            'type': 'game_data',
                            'message': data
                        }
                    )
                #need to update it later
                elif game == 'game3':
                    data = {
                        'message': 'match_result',
                        'winner': tournament['player6_alias'],
                        'left_score': self.left_score,
                        'loser': tournament['player5_alias'],
                        'right_score': self.right_score
                    }
                    await self.channel_layer.group_send(
                        tournament['group3'],
                        {
                            'type': 'game_data',
                            'message': data
                        }
                    )
        elif self.ballx >= self.game_width - 15:
            self.ballx = 400
            self.bally = 250
            self.balldirectionX = 1
            self.balldirectionY = random.uniform(-1, 1)
            self.left_score += 1
            self.bonus = 0
            if (self.left_score >= 8):
                self.game_loop = False
                if game == 'game1':
                    data = {
                        'message': 'match_result',
                        'winner': tournament['player1_alias'],
                        'left_score': self.left_score,
                        'loser': tournament['player2_alias'],
                        'right_score': self.right_score
                    }
                    await self.channel_layer.group_send(
                        tournament['group1'],
                        {
                            'type': 'game_data',
                            'message': data
                        }
                    )
                elif game == 'game2':
                    data = {
                        'message': 'match_result',
                        'winner': tournament['player3_alias'],
                        'left_score': self.left_score,
                        'loser': tournament['player4_alias'],
                        'right_score': self.right_score
                    }
                    await self.channel_layer.group_send(
                        tournament['group2'],
                        {
                            'type': 'game_data',
                            'message': data
                        }
                    )
        await self.pack_data_to_send(tournament, game)

    async def pack_data_to_send(self, tournament, game):
        data = {
            'message': 'game_data',
            'ballx': self.ballx,
            'bally': self.bally,
            'right_paddleY': self.right_paddleY,
            'left_paddleY': self.left_paddleY,
            'right_score': self.right_score,
            'left_score': self.left_score,
            'game_width': self.game_width,
            'game_height': self.game_height,
            'ball_radius': 15,
        }

        if game == 'game1':
            await self.channel_layer.group_send(
                tournament['group1'],
                {
                    'type': 'game_data',
                    'message': data
                }
            )
        elif game == 'game2':
            await self.channel_layer.group_send(
                tournament['group2'],
                {
                    'type': 'game_data',
                    'message': data
                }
            )
