from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from login.models import Player

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        username = "bot"
        password = "bot1234"
        user = Player.objects.create_user(username=username, password=password)
        user.save()