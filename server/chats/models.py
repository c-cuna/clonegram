from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

class Chats(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=300)
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE, default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL)

