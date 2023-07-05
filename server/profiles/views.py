from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework import generics, viewsets, parsers, views, status

from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import FollowerRelation, Profile
from .serializers import FollowingSerializer, PublicProfileSerializer, ProfileSerializer, FollowSerializer

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync, sync_to_async

from notifications.models import Notifications
from django.contrib.auth import get_user_model
User = get_user_model()

class UserFollowingViewSet(viewsets.ModelViewSet):
    queryset = FollowerRelation.objects.all()
    serializer_class = FollowSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer, **kwargs):
        kwargs['user'] = self.request.user
        
        channel_layer = get_channel_layer()
        receiver =  self.request.data.get('following_user')
        sender = self.request.user

        receiver_user_instance = User.objects.get(id=receiver)
        notification_type = "follow"
        message= f'@{sender.username} followed you'
        notif_object = Notifications.objects.create(sender=sender, receiver=receiver_user_instance, notification_type=notification_type, message=message)

        async_to_sync(channel_layer.group_send)(
        "user_%s" % str(receiver),
            {
                "type": "send_notification",
                "notif_id": notif_object.id,
                "post": -1,
                "message": message,
                "sender": str(sender.id),
                "receiver": str(receiver),
                "notification_type": notification_type
            },
        )
        
        serializer.save(**kwargs)

    def destroy(self, request, *args, **kwargs):
        channel_layer = get_channel_layer()
        instance = FollowerRelation.objects.filter(user=self.request.user, following_user=self.kwargs.get(self.lookup_field))
        self.perform_destroy(instance)
        notif_object =  Notifications.objects.get(sender=self.request.user.id, receiver=self.kwargs.get(self.lookup_field), notification_type="follow")
        Notifications.objects.filter(sender=self.request.user.id, receiver=self.kwargs.get(self.lookup_field), notification_type="follow").delete()
        async_to_sync(channel_layer.group_send)(
            "user_%s" % str(self.kwargs.get(self.lookup_field)),
            {
                "type": "send_notification",
                "notif_id": notif_object.id,
                "post": -1,
                "message": f'@{self.request.user.username} unfollowed you',
                "sender": str(self.request.user.id),
                "receiver": str(self.kwargs.get(self.lookup_field)),
                "notification_type": "unfollow"
            },
        )
        return Response(status=status.HTTP_204_NO_CONTENT)


class UnfollowViewSet(generics.DestroyAPIView):
    serializer_class = FollowingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = FollowerRelation.objects.filter(
            user=self.kwargs['pk'], following_user=self.request.user)
        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PublicProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all().select_related("user")
    lookup_field = "user__username"
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = PublicProfileSerializer

class ProfilePicUploadView(views.APIView):
    queryset = Profile.objects.all()
    parser_classes = (parsers.MultiPartParser, )
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get', 'post', 'head']

    def get(self, request, pk=None):
        model = get_object_or_404(Profile, user=request.user)
        serializer = ProfileSerializer(model, partial=False)
        return Response(serializer.data.profile_picture)

    def post(self, request, pk=None):
        model = get_object_or_404(Profile, user=request.user)
        data = {"profile_picture": request.data['profile_picture']}
        serializer = ProfileSerializer(model, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
