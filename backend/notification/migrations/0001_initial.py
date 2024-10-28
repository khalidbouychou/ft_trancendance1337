# Generated by Django 4.2.16 on 2024-10-28 01:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('notif_type', models.CharField(choices=[('FR', 'Friend Request'), ('GR', 'Game Request')], max_length=2)),
                ('game_type', models.CharField(blank=True, choices=[('PG', 'Pong'), ('TT', 'TicTacToe')], max_length=2, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('cancelled', 'Cancelled'), ('declined', 'Declined'), ('expired', 'Expired')], default='pending', max_length=10)),
                ('is_read', models.BooleanField(default=False)),
                ('game_room', models.CharField(default='', max_length=255)),
                ('from_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_notifications', to=settings.AUTH_USER_MODEL)),
                ('to_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_notifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddConstraint(
            model_name='notification',
            constraint=models.UniqueConstraint(condition=models.Q(('status', 'pending')), fields=('from_user', 'to_user', 'notif_type', 'game_type', 'game_room'), name='unique_pending_notification'),
        ),
    ]
