from django.contrib import admin
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static

from rest_framework.routers import DefaultRouter

from accounts.views import UserSearchApiView
from posts.views import PostLikesViewSet, PostCommentsViewSet, PostViewSet, UserFeedApiView, UserPostsApiView
from profiles.views import PublicProfileViewSet, UserFollowingViewSet, ProfilePicUploadView, UnfollowViewSet
from notifications.views import UserNotificationApiView, UserNotificationsCountView, UserNotificationsGetView

from . import views
router = DefaultRouter()


router.register(r'posts', PostViewSet, basename='posts')
router.register(r'profile', PublicProfileViewSet, basename='profile')
router.register(r'following', UserFollowingViewSet, basename='following')
router.register(r'comments', PostCommentsViewSet, basename='comments')
router.register(r'likes', PostLikesViewSet, basename='likes')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('', include(router.urls)),
    path('search/', UserSearchApiView.as_view(), name='search'),
    path('unfollow/<int:pk>/', UnfollowViewSet.as_view(), name='unfollow'),
    path('profile/posts/<slug:username>/', UserPostsApiView.as_view(), name='posts'),
    path('profile_picture/', ProfilePicUploadView.as_view(), name='upload_picture'),
    path('feed/', UserFeedApiView.as_view(), name='feed'),
    path('notifications/get/<int:pk>/', UserNotificationsGetView.as_view(), name='notifications'),
    path('notifications/', UserNotificationApiView.as_view(), name='notifications'),
    path('notifications/count/', UserNotificationsCountView.as_view(), name='notifications_count'),
    path('notifications/<int:pk>/', UserNotificationApiView.as_view(), name='notification_detail'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)