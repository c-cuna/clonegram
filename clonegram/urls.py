from django.contrib import admin
from django.conf import settings
from django.urls import path, include, re_path
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


from rest_framework.routers import SimpleRouter

from accounts.views import UserSearchApiView
from posts.views import PostLikesViewSet, PostCommentsViewSet, PostViewSet, UserFeedApiView, UserPostsApiView
from profiles.views import PublicProfileViewSet, UserFollowingViewSet, ProfilePicUploadView, UnfollowViewSet
from notifications.views import UserNotificationApiView, UserNotificationsCountView, UserNotificationsGetView

from . import views
router = SimpleRouter()

router.register(r'posts', PostViewSet, basename='posts')
router.register(r'profile', PublicProfileViewSet, basename='profile')
router.register(r'following', UserFollowingViewSet, basename='following')
router.register(r'comments', PostCommentsViewSet, basename='comments')
router.register(r'likes', PostLikesViewSet, basename='likes')

schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path(r'api/v1/', include(router.urls)),
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/search/', UserSearchApiView.as_view(), name='search'),
    path('api/v1/unfollow/<int:pk>/', UnfollowViewSet.as_view(), name='unfollow'),
    path('api/v1/profile/posts/<slug:username>/', UserPostsApiView.as_view(), name='posts'),
    path('api/v1/profile_picture/', ProfilePicUploadView.as_view(), name='upload_picture'),
    path('api/v1/feed/', UserFeedApiView.as_view(), name='feed'),
    path('api/v1/notifications/get/<int:pk>/', UserNotificationsGetView.as_view(), name='notifications'),
    path('api/v1/notifications/', UserNotificationApiView.as_view(), name='notifications'),
    path('api/v1/notifications/count/', UserNotificationsCountView.as_view(), name='notifications_count'),
    path('api/v1/notifications/<int:pk>/', UserNotificationApiView.as_view(), name='notification_detail'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [
        path('api/v1/swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
        path('api/v1/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('api/v1/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ]

