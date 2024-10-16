# Generated by Django 4.2.16 on 2024-10-16 16:25

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0004_friend_player_friends'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='friends',
            field=models.ManyToManyField(blank=True, through='login.Friend', to=settings.AUTH_USER_MODEL),
        ),
    ]
