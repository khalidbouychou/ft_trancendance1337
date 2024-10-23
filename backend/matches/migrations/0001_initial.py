# Generated by Django 4.2.16 on 2024-10-23 12:15

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
            name='Matches',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('winner', models.CharField(max_length=100)),
                ('loser', models.CharField(max_length=100)),
                ('left_score', models.IntegerField()),
                ('right_score', models.IntegerField()),
                ('opponent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='opponent', to=settings.AUTH_USER_MODEL)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'matches',
            },
        ),
    ]
