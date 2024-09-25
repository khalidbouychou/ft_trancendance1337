# Generated by Django 4.2.14 on 2024-08-11 14:37

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0005_rename_perc_user_percentage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='name',
            field=models.CharField(max_length=10, unique=True, validators=[django.core.validators.MinLengthValidator(3)]),
        ),
    ]
