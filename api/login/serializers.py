 
from rest_framework import serializers

from .models import myuser


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = myuser
        fields = '__all__'

# class TwoFASerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Player
#         fields = ['two_factor']