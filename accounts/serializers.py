from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password,make_password

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.validators import UniqueValidator

from profiles.serializers import ProfileSerializer, ProfilePictureSerializer
from profiles.models import Profile, FollowerRelation
User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls, user):
		token = super(MyTokenObtainPairSerializer, cls).get_token(user)
		
		token['username'] = user.username
		return token
	
class UserSerializer(serializers.ModelSerializer):
	# profile = ProfilePictureSerializer(read_only=True)
	profile = ProfileSerializer(many=False)

	class Meta:
		model = User
		fields = ('id', 'profile', 'first_name', 'last_name', 'email', 'username')


	def update(self, instance, validated_data):
		profile_data = validated_data.pop('profile')
		instance.username = validated_data.get('username', instance.username)
		instance.email = validated_data.get('email', instance.email)
		instance.first_name = validated_data.get('first_name', instance.first_name)
		instance.last_name = validated_data.get('last_name', instance.last_name)
		instance.save()
		
		profile_instance = Profile.objects.get(user=instance.id)
		profile_instance.bio = profile_data.get('bio', profile_instance.bio)
		profile_instance.location = profile_data.get('location', profile_instance.location)
		profile_instance.save()
		
		return instance

class PublicUserSerializer(serializers.ModelSerializer):
	profile = ProfilePictureSerializer(read_only=True)
	is_following = serializers.SerializerMethodField(read_only=True)
	is_self = serializers.SerializerMethodField(read_only=True)

	class Meta:
		model = User
		fields = ('id', 'profile', 'first_name', 'last_name', 'email', 'username', 'is_following', 'is_self')
	
	def get_is_following(self, obj):
		is_following = False
		context = self.context
		request = context.get("request")
		if request:
			user = request.user
			print(user)
			if(user == obj):
				return True
			is_following = FollowerRelation.objects.filter(user=user, following_user=obj).exists()
		return is_following
    
	def get_is_self(self, obj):
		is_self = False
		context = self.context
		request = context.get("request")
		if request:
			user = request.user
			if (user == obj):
				is_self = True
		return is_self

class AccountSerializer(serializers.ModelSerializer):
	
	email = serializers.EmailField(
		required = True,
		validators=[UniqueValidator(queryset=User.objects.all())]
	)
	password = serializers.CharField(
		style={"input_type": "password"},
		write_only = True,
		required = True,
		validators=[validate_password]
	)
	password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)
	profile = ProfileSerializer()
	
	class Meta:
		model = User
		fields = ['id', 'username','email', 'password', 'password2', 'first_name', 'last_name', 'profile']
		depth = 1
		extra_kwargs = {
			'first_name': {'required': True},
      		'last_name': {'required': True},
		}
	
	def validate(self, attrs):
		password = attrs.get('password')
		password2 = attrs.pop('password2')
		if password != password2:
			raise serializers.ValidationError({"password": "Password fields didn't match."})
		return attrs

	def create(self, validated_data):
		user = User.objects.create(
			username=validated_data['username'],
        	email=validated_data['email'],
        	first_name=validated_data['first_name'],
        	last_name=validated_data['last_name']
		)
		user.set_password(validated_data['password'])
		user.save()
		Profile.objects.create(user=user)
		return user
	
	def update(self, instance, validated_data):
		profile_data = validated_data.pop('profile')
		instance.username = validated_data.get('username', instance.username)
		instance.email = validated_data.get('email', instance.email)
		instance.email = validated_data.get('first_name', instance.first_name)
		instance.email = validated_data.get('last_name', instance.last_name)
		instance.save()
		
		profile_instance = Profile.objects.get(id=profile_data['id'])
		profile_instance.location = profile_data.get('bio', profile_instance.bio)
		profile_instance.location = profile_data.get('location', profile_instance.location)
		profile_instance.save()
		
		return instance

class ChangePasswordSerializer(serializers.ModelSerializer):
	old_password = serializers.CharField(required=True, write_only=True)
	password = serializers.CharField(required=True, write_only=True)
	password2 = serializers.CharField(required=True, write_only=True)

	def update(self, instance, validated_data):
		instance.password = validated_data.get('password', instance.password)
		
		if instance.password != validated_data['old_password']:
			print(instance.password)
			print(validated_data['old_password'])
			raise serializers.ValidationError({'old_password': 'wrong password'})
		
		if validated_data['password'] != validated_data['password2']:
			raise serializers.ValidationError({'passwords': 'passwords do not match'})	
		instance.set_password(validated_data['password'])
		instance.save()
		return instance	
	
	class Meta:
		model = User
		fields = ['old_password', 'password','password2']