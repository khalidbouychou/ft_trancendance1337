from django.contrib import admin
from .models import Player, Friend , PingData
# Register your models here.


admin.site.register(Player)
admin.site.register(Friend)
admin.site.register(PingData)

# admin.site.register(MatchHistory)
