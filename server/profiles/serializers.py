from django.contrib.auth.models import User

from rest_framework import serializers
from .models import Profile, FollowerRelation
# from accounts.serializers import UserSerializer
# class ProfilePictureSerializer(serializers.ModelSerializer)

class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowerRelation
        fields = ( "following_user", "timestamp")

class FollowingSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='following_user.id')
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    profile_picture = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)
    username = serializers.SerializerMethodField(read_only=True)
    profile_picture = serializers.SerializerMethodField(read_only=True)
    is_following = serializers.SerializerMethodField(read_only=True)
    is_self = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FollowerRelation
        fields = ( "id", "timestamp", "first_name", "last_name", "email", "username", "profile_picture", "is_following", "is_self")

    def get_first_name(self, obj):
        return obj.following_user.first_name
    
    def get_last_name(self, obj):
        return obj.following_user.last_name

    def get_username(self, obj):
        return obj.following_user.username
    
    def get_email(self, obj):
        return obj.following_user.email

    def get_profile_picture(self, obj):
        return ProfilePictureSerializer(instance=obj.following_user.profile, many=False, context=self.context).data['profile_picture']
    
    def get_is_following(self, obj):
        is_following = False
        context = self.context
        request = context.get("request")
        if request:
            user = request.user
            if (obj.following_user == user):
                is_following = True
            else:
                is_following = FollowerRelation.objects.filter(user=user, following_user=obj.following_user).exists()
        return is_following
    
    def get_is_self(self, obj):
        is_self = False
        context = self.context
        request = context.get("request")
        if request:
            user = request.user
            if (obj.following_user == user):
                is_self = True
        return is_self

class FollowersSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    email = serializers.SerializerMethodField(read_only=True)
    username = serializers.SerializerMethodField(read_only=True)
    profile_picture = serializers.SerializerMethodField(read_only=True)
    is_following = serializers.SerializerMethodField(read_only=True)
    is_self = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = FollowerRelation
        fields = ("user", "timestamp", "first_name", "last_name", "email", "username", "profile_picture", "is_following", "is_self")

    def get_first_name(self, obj):
        return obj.user.first_name
    
    def get_last_name(self, obj):
        return obj.user.last_name

    def get_username(self, obj):
        return obj.user.username
    
    def get_email(self, obj):
        return obj.user.email

    def get_profile_picture(self, obj):
        return ProfilePictureSerializer(instance=obj.user.profile, many=False, context=self.context).data['profile_picture']
    
    def get_is_following(self, obj):
        is_following = False
        context = self.context
        request = context.get("request")
        if request:
            user = request.user
            if (obj.user == user):
                is_following = True
            else:
                is_following = FollowerRelation.objects.filter(user=user, following_user=obj.user).exists()
        return is_following
    
    def get_is_self(self, obj):
        is_self = False
        context = self.context
        request = context.get("request")
        if request:
            user = request.user
            if (obj.user == user):
                is_self = True
        return is_self

class PublicProfileSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField(read_only=True)
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    following = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField(read_only=True)
    is_self = serializers.SerializerMethodField(read_only=True)
    following_count = serializers.SerializerMethodField(read_only=True)
    followers_count = serializers.SerializerMethodField(read_only=True)
    posts_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "profile_picture",
            "first_name",
            "last_name",
            "bio",
            "location",
            "following",
            "followers",
            "followers_count",
            "following_count",
            "posts_count",
            "is_following",
            "is_self",
            "username",
        ]
    
    def get_id(self, obj):
        return obj.user.id

    def get_first_name(self, obj):
        return obj.user.first_name
    
    def get_last_name(self, obj):
        return obj.user.last_name
    
    def get_username(self, obj):
        return obj.user.username
    
    def get_following(self, obj):
        return FollowingSerializer(obj.user.following.all(), context=self.context, many=True).data
    
    def get_followers(self, obj):
        return FollowersSerializer(obj.user.followers.all(), context=self.context, many=True).data

    def get_is_following(self, obj):
        is_following = False
        context = self.context
        request = context.get("request")
        if request:
            user = request.user
            is_following = FollowerRelation.objects.filter(user=user, following_user=obj.user).exists()
        return is_following
    
    def get_is_self(self, obj):
        is_self = False
        context = self.context
        request = context.get("request")
        if request:
            user = request.user
            if (obj.user == user):
                is_self = True
        return is_self

    def get_following_count(self, obj):
        return obj.user.following.count()
    
    def get_followers_count(self, obj):
        return obj.user.followers.count()
    
    def get_posts_count(self, obj):
        return obj.user.posts.count()

class ProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    class Meta:
        model = Profile
        fields = [
            "location",
            "bio",
            "profile_picture",
        ]
    

    
class ProfilePictureSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False)
    class Meta:
        model = Profile
        fields = ["profile_picture"]
        