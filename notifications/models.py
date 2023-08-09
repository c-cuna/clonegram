from django.db import models
from django.conf import settings
from posts.models import Posts
User = settings.AUTH_USER_MODEL


class Notifications(models.Model):
    receiver = models.ForeignKey(User, null=True, blank=True, related_name='user_receiver', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, null=True, blank=True, related_name='user_sender', on_delete=models.CASCADE)
    post = models.ForeignKey(Posts, null=True, blank=True, related_name='user_sender', on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=264, null=True, blank=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
