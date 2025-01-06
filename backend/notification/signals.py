from django.db.models.signals import post_save, pre_save, pre_delete
from django.dispatch import receiver
from .models import Notification
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers import NotificationSerializer
from django.core.exceptions import ObjectDoesNotExist
from login.models import Friend
from django.db.models import Q
import json

@receiver(post_save, sender=Notification)
def notify_user(sender, instance, created, **kwargs):
    if created:
        if instance.notif_type == 'FR':
            friends = Friend.objects.filter(Q(user1=instance.from_user, user2=instance.to_user) |
                                            Q(user1=instance.to_user, user2=instance.from_user))
            if not friends.exists():
                Friend.objects.create(user1=instance.from_user, user2=instance.to_user, status='pending')
        channel_layer = get_channel_layer()
        notification_serializer = NotificationSerializer(instance) 
        room_group_name = f'user_{instance.to_user.id}_NOTIF'
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'send_notification',
                'notification': notification_serializer.data
            }
        )
    else:
        if instance.notif_type == 'FR' and instance.status != 'declined':
            friends = Friend.objects.filter(Q(user1=instance.from_user, user2=instance.to_user) |
                                            Q(user1=instance.to_user, user2=instance.from_user))
            if friends.exists():
                friends.update(status='friends' if instance.status == 'accepted' else 'None')
                data1 = {
                    'message': 'friend_status_changed',
                    'user_id': instance.from_user.id,
                    'status': 'friends'
                }
                data2 = {
                    'message': 'friend_status_changed',
                    'user_id': instance.to_user.id,
                    'status': 'friends'
                }
                channel_layer = get_channel_layer()
                notification_serializer = NotificationSerializer(instance)
                room_group_name1 = f'user_{instance.to_user.id}_NOTIF'
                room_group_name2 = f'user_{instance.from_user.id}_NOTIF'
                async_to_sync(channel_layer.group_send)(
                    room_group_name1,
                    {
                        'type': 'send_notification', 
                        'notification': data1
                    }
                )
                async_to_sync(channel_layer.group_send)(
                    room_group_name2,
                    {
                        'type': 'send_notification',
                        'notification': data2
                    }
                )

@receiver(pre_delete, sender=Friend)
def notify_users(sender, instance, **kwargs):
    print("instance: ", instance)
    data1 = {
        'message': 'friend_status_changed',
        'user_id': instance.user2_id,
        'status': 'unfriend'
    }
    data2 = {
        'message': 'friend_status_changed',
        'user_id': instance.user1_id,
        'status': 'unfriend'
    }
    channel_layer = get_channel_layer()
    notification_serializer = NotificationSerializer(instance)
    room_group_name1 = f'user_{instance.user1_id}_NOTIF'
    room_group_name2 = f'user_{instance.user2_id}_NOTIF'
    print("room_group_name1:", room_group_name1, "room_group_name2", room_group_name2)
    async_to_sync(channel_layer.group_send)(
        room_group_name1,
        {
            'type': 'send_notification',
            'notification': data1
        }
    )
    async_to_sync(channel_layer.group_send)(
        room_group_name2,
        {
            'type': 'send_notification',
            'notification': data2
        }
    )

async def send_notification(self, event):
    data = event['notification']
    await self.send(text_data=json.dumps(data))

@receiver(pre_save, sender=Notification)
def check_GR_status_change(sender, instance, **kwargs):
    by_receiver_status = ['accepted', 'declined']
    if instance.pk:
        try:
            old_instance = Notification.objects.get(pk=instance.pk)
        except Notification.DoesNotExist:
            print('Notification does not exist')
            return
        if old_instance.status != 'pending':
            return
        channel_layer = get_channel_layer()
        status = instance.status
        if instance.status == 'accepted' and instance.notif_type == 'GR' and instance.is_expired():
            status = 'expired'
            if instance.from_user.status_game != 'available':
                status = 'unavailable'
        Notification.objects.filter(pk=instance.pk).update(status=status)
        instance.refresh_from_db()
        notification_serializer = NotificationSerializer(instance)
        user_id = instance.from_user.id if status in by_receiver_status else instance.to_user.id
        room_group_name = f'user_{user_id}_NOTIF'
        print(f'Sending notification to group {room_group_name}, status: {status}') 

        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': 'send_notification',
                'notification': notification_serializer.data
            }
        )
