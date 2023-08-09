import uuid

from django.conf import settings
from django.db import models

User = settings.AUTH_USER_MODEL

def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class PostLikes(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey("Posts", related_name="likes", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="user", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['post','user'],  name="unique_likes")
        ]

        ordering = ["-timestamp"]
    
    def __str__(self):
        f"{self.user} likes {self.post}"

class PostComments(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    comment = models.TextField()
    parent = models.ForeignKey('self', related_name="parent_comment", null=True, on_delete=models.CASCADE)
    post = models.ForeignKey("Posts", related_name="comments", on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name="author", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
    
    def __str__(self):
        f"{self.user} likes {self.post}"

    

class Posts(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, related_name="posts", null=True, on_delete=models.CASCADE)
    image_url = models.FileField(upload_to=upload_to, blank=True, null=True)
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-id", "-timestamp"]
