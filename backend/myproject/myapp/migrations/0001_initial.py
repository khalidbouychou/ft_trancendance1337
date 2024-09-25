# Generated by Django 4.2.14 on 2024-08-06 10:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10, unique=True)),
                ('login', models.CharField(max_length=10, unique=True)),
                ('level', models.IntegerField()),
                ('ratio', models.IntegerField()),
                ('match_total', models.IntegerField()),
                ('wins', models.IntegerField()),
                ('losses', models.IntegerField()),
            ],
        ),
    ]
