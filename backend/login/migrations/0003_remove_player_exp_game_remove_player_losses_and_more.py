# Generated by Django 4.2.16 on 2024-10-20 18:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('login', '0002_player_profile_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='player',
            name='exp_game',
        ),
        migrations.RemoveField(
            model_name='player',
            name='losses',
        ),
        migrations.RemoveField(
            model_name='player',
            name='wins',
        ),
        migrations.CreateModel(
            name='TicData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wins', models.IntegerField(default=0)),
                ('losses', models.IntegerField(default=0)),
                ('exp_game', models.IntegerField(default=100)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tic_data', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'tic_data',
            },
        ),
        migrations.CreateModel(
            name='PingData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wins', models.IntegerField(default=0)),
                ('losses', models.IntegerField(default=0)),
                ('exp_game', models.IntegerField(default=100)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ping_data', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'ping_data',
            },
        ),
    ]
