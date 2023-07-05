from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class FollowerRelation(models.Model):
    user = models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
    following_user = models.ForeignKey(User, related_name="followers", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user','following_user'],  name="unique_followers")
        ]

        ordering = ["-timestamp"]

class Profile(models.Model):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    location = models.CharField(max_length=220, null=True, blank=True)
    handle = models.CharField(max_length=160, null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to=upload_to, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)