from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from .models import Notification
from login.serializers import PlayerSerializer
from .serializers import NotificationSerializer
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.decorators import api_view  , permission_classes , authentication_classes


class NotificationView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        all_notifs = Notification.objects.filter(
            Q(to_user=request.user) | Q(from_user=request.user),
            status='pending'
        ).order_by('-created_at')
        expired_notifs = []
        for notif in all_notifs:
            if notif.notif_type == 'GR' and notif.is_expired():
                expired_notifs.append(notif.id)
        Notification.objects.filter(id__in=expired_notifs).update(status='expired')
        all_notifs = all_notifs.exclude(id__in=expired_notifs)

        all_received_notifs = all_notifs.filter(to_user=request.user)
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