# Generated by Django 4.2.14 on 2024-08-08 11:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_friendship_blockedfriend'),
    ]

    operations = [
        migrations.RenameField(
            model_name='blockedfriend',
            old_name='friend',
            new_name='blocked_friend',
        ),
    ]
