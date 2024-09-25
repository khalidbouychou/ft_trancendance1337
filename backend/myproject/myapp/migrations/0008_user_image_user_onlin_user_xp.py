# Generated by Django 4.2.14 on 2024-08-27 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0007_alter_user_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='user_images/'),
        ),
        migrations.AddField(
            model_name='user',
            name='onlin',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='xp',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
