from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import views, generics, viewsets, permissions, status
from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync

from .models import PostComments, PostLikes, Posts
from .serializer import CommentsSerializer, LikesSerializer, PostSerializer
from profiles.models import FollowerRelation
from notifications.models import Notifications


from django.contrib.auth import get_user_model
User = get_user_model()


class PostViewSet(viewsets.ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer
    many=True

    permission_classes = [
        permissions.IsAuthenticated]
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PostLikesViewSet(viewsets.ModelViewSet):
    queryset = PostLikes.objects.all()
    serializer_class = LikesSerializer
    lookup_field = "post"
    permission_classes = [
        permissions.IsAuthenticated]

    def perform_create(self, serializer):
        channel_layer = get_channel_layer()
        
        post_id =  self.request.data.get('post')
        post_model = Posts.objects.get(id=post_id)
        post_serializer = PostSerializer(post_model, context=super().get_serializer_context(), partial = False)
        receiver = post_serializer.data["user"]
        sender = self.request.user
  

        receiver_user_instance = User.objects.get(id=receiver["id"])
    
        notification_type = "like"
        message = sender.username + " liked your post"
        notif_object = Notifications.objects.create(sender=sender, receiver=receiver_user_instance, notification_type=notification_type, post=post_model, message=message)

        async_to_sync(channel_layer.group_send)(
            "user_%s" % str(receiver["id"]),
            {
                "type": "send_notification",
                "notif_id": notif_object.id,
                "post": str(post_id),
                "message": f'@{sender.username} liked your post',
                "sender": str(sender.id),
                "receiver": str(receiver["id"]),
                "notification_type": "like"
            },
        )
        PostSerializer()
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        channel_layer = get_channel_layer()

        instance = PostLikes.objects.get(user=self.request.user, post=self.kwargs.get(self.lookup_field))
        post = Posts.objects.get(id=self.kwargs.get(self.lookup_field))
        notif_objects = Notifications.objects.filter(sender=self.request.user.id, receiver=post.user.id, post=self.kwargs.get(self.lookup_field), notification_type="like")
        notif_object = notif_objects.first()
        notif_objects.delete()
        
        
        self.perform_destroy(instance)
        async_to_sync(channel_layer.group_send)(
            "user_%s" % str(post.user.id),
            {
                "type": "send_notification",
                "notif_id": notif_object.id,
                "post": str(self.kwargs.get(self.lookup_field)),
                "message": f'@{self.request.user.username} unliked your post',
                "sender": str(self.request.user.id),
                "receiver": str(post.user.id),
                "notification_type": "dislike"
            },
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

class PostCommentsViewSet(viewsets.ModelViewSet):
    queryset = PostComments.objects.all()
    serializer_class = CommentsSerializer
    permission_classes = [
        permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        channel_layer = get_channel_layer()
        post_id =  self.request.data.get('post')
        comment = self.request.data.get('comment')
        post_model = Posts.objects.get(id=post_id)
        post_serializer = PostSerializer(post_model, context=super().get_serializer_context(), partial = False)
        receiver = post_serializer.data["user"]
        sender = self.request.user
        receiver_user_instance = User.objects.get(id=receiver["id"])
        notification_type = "comment"
        message= f'@{sender.username} commented: {comment}'
        notif_object = Notifications.objects.create(sender=sender, receiver=receiver_user_instance, notification_type=notification_type, post=post_model, message=message)

        async_to_sync(channel_layer.group_send)(
        "user_%s" % str(receiver["id"]),
            {
                "type": "send_notification",
                "notif_id": notif_object.id,
                "post": str(post_id),
                "message": message,
                "sender": str(sender.id),
                "receiver": str(receiver["id"]),
                "notification_type": notification_type
            },
        )
        serializer.save(user=self.request.user)

class UserFeedApiView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostSerializer

    def get(self, request, pk=None):
        per_page = 5
        follows = FollowerRelation.objects.filter(user=request.user).values_list('following_user', flat=True)
        feed_queryset = Posts.objects.filter( Q(user__id__in=follows) | Q(user__id__exact=request.user.id) ).order_by("-timestamp")
        paginator = Paginator(feed_queryset, per_page=per_page)
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
    
class UserPostsApiView(generics.ListAPIView):
    serializer_class = PostSerializer
    
    def get(self, request, *args, **kwargs):
        per_page = 9
        queryset = Posts.objects.filter(user__username=self.kwargs['username']).order_by('-timestamp')
        paginator = Paginator(queryset, per_page=per_page)
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