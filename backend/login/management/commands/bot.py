from django.core.management.base import BaseCommand
from login.models import Player

class Command(BaseCommand):
   def handle(self, *args, **options):
        username = "ke3ki3a"
        profile_name = "ke3ki3a"
        email = "ke3ki3a@gmail.com"
        password = 'ke3ki3a'
        avatar = 'https://static.vecteezy.com/system/resources/thumbnails/024/238/434/small_2x/ai-generated-small-robots-futuristic-marvels-of-artificial-intelligence-free-png.png'

        if Player.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User with username "{username}" already exists.'))
        else:
            Player.objects.create_user(username=username, profile_name=profile_name, avatar=avatar, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Bot user "{username}" created successfully.'))