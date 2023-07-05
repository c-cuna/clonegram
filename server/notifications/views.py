from django.shortcuts import render
from django.db.models import Q
from django.http import JsonResponse
from django.core.paginator import Paginator
from rest_framework.response import Response
from rest_framework import views, generics, viewsets, permissions, status
from rest_framework.renderers import JSONRenderer
# Create your views here.
from datetime import datetime

# Django Channels
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .serializers import NotificationSerializer
from .models import Notifications

def notification_test_page(request):

    # Django Channels Notifications Test
    current_user = request.user
    channel_layer = get_channel_layer()
    data = "notification"+ "...." + str(datetime.now())
    # Trigger message sent to group
    async_to_sync(channel_layer.group_send)(
        str(current_user.pk),  # Channel Name, Should always be string
        {
            "type": "notify",   # Custom Function written in the consumers.py
            "text": data,
        },
    )     
    return render(request, 'django_notifications_app/notifications_test_page.html')

class UserNotificationsCountView(generics.RetrieveAPIView):
    """
    A view that returns the count of active users.
    """
    renderer_classes = (JSONRenderer, )

    def get(self, request, format=None):
        user_count = Notifications.objects.filter(receiver__id__exact=request.user.id, is_read=False).count()
        
        content = {'notification_count': user_count}
        return Response(content)

class UserNotificationsGetView(generics.RetrieveAPIView):
    queryset = Notifications.objects.all()
    serializer_class = NotificationSerializer
    lookup_field = 'pk'

class UserNotificationApiView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    # authentication_classes = [permissions.token]
    serializer_class = NotificationSerializer
    ordering = ['-id']
    queryset = Notifications.objects.all()

    def get(self, request, pk=None):
        per_page = 10
        notification_queryset = Notifications.objects.filter(Q(receiver__id__exact=request.user.id) ).order_by("-timestamp")
        paginator = Paginator(notification_queryset, per_page=per_page)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        data_set = self.serializer_class(
            page_obj, many=True, context={"request": request}
        ).data

        data = {
        'results': list(data_set),
        'has_next': page_obj.has_next(),
        'page_number': page_number
        }
        return JsonResponse(data=data)

    def partial_update(self, request, *args, **kwargs):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "user_%s" % str(request.user.id),
            {
                "type": "read_notification",
                "message": "notification has read status has changed",
                "is_read": request.data.get("is_read")                
            },
        )
        return super().partial_update(request, *args, **kwargs)
