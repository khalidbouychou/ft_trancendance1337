from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from login.serializers import PlayerSerializer
from .serializers import NotificationSerializer

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_notifications(request):
    all_notifs = Notification.objects.filter(to_user=request.user).order_by('-created_at')
    all_received_notifs = all_notifs.filter(status='pending')   
    all_received_notifs.update(is_read=True)
    FR_notif_received = all_received_notifs.filter(notif_type='FR')
    GR_notif_received = all_received_notifs.filter(notif_type='GR')
    FR_notif_sent = all_notifs.filter(from_user=request.user, notif_type='FR')
    GR_notif_sent = all_notifs.filter(from_user=request.user, notif_type='GR')

    context = {
        'FR_notif_received': NotificationSerializer(FR_notif_received, many=True).data,
        'GR_notif_received': NotificationSerializer(GR_notif_received, many=True).data,
        'FR_notif_sent': NotificationSerializer(FR_notif_sent, many=True).data,
        'GR_notif_sent': NotificationSerializer(GR_notif_sent, many=True).data,
    }
    return Response(context)