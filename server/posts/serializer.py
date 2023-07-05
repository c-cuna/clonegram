from rest_framework import serializers
from .models import PostComments, PostLikes, Posts
from accounts.serializers import UserSerializer
from profiles.serializers import ProfilePictureSerializer, FollowersSerializer

class LikesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    is_following = serializers.SerializerMethodField(read_only=True)
    is_self = serializers.SerializerMethodField(read_only=True)
    profile_picture = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PostLikes
        fields = ("post", "user", "profile_picture", "timestamp", "is_following", "is_self")

    def get_profile_picture(self, obj):
        return ProfilePictureSerializer(instance=obj.user.profile, many=False, context=self.context).data['profile_picture']
    
    def get_is_following(self, obj):
        is_following = False
        context = self.context
        request = context.get("request")
        if request:
            user = request.user
            if(user == obj.user):
                return True
            is_following = user in FollowersSerializer(obj.user.followers.all(), many=True).data
        return is_following
    
    def get_is_self(self, obj):
        is_self = False
        context = self.context
        request = context.get("request")
        if request:
            user = request.user
            if (user == obj.user):
                is_self = True
        return is_self

class CommentsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PostComments
        fields = ("id", "post", "comment", "user", "timestamp")

        def get_related_field(self, model_field):
            return CommentsSerializer()

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image_url = serializers.ImageField(required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    profile_picture = serializers.SerializerMethodField(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    like_count = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    comments_count = serializers.SerializerMethodField(read_only=True)
    is_liked = serializers.SerializerMethodField(read_only=True)
    current_user = serializers.SerializerMethodField('_owner')

   
    class Meta:
        model = Posts
        fields = ['id', 'user', "profile_picture",  "username", 'description', 'image_url', 'likes', 'like_count', 'comments', 'comments_count', 'is_liked', 'current_user', 'timestamp']

     # Use this method for the custom field
    def _owner(self, obj):
        request = self.context.get('request', None)
        if request:
            return UserSerializer(request.user).data

    def get_profile_picture(self, obj):
        return ProfilePictureSerializer(instance=obj.user.profile, many=False, context=self.context).data['profile_picture']

    def get_likes(self, obj):
        return LikesSerializer(obj.likes.all(), context=self.context, many=True).data
    
    def get_username(self, obj):
        return obj.user.username

    def get_comments(self, obj):
        return CommentsSerializer(obj.comments.all(), many=True).data

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_is_liked(self, post):
        qs = PostLikes.objects.filter(post=post).exists()
        # serializer = LikesSerializer(instance=qs, many=True)
        if(qs):
            return True
        return False