from rest_framework import serializers
from .models import Notifications
from accounts.serializers import UserSerializer
from posts.serializer import PostSerializer

class NotificationSerializer(serializers.ModelSerializer):

    receiver = UserSerializer(read_only=True)
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Notifications
        fields =["id", "receiver", "sender", "post", "is_read", "notification_type", "message", "timestamp"]