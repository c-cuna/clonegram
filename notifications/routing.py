from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from notifications import consumers
from .middleware import TokenAuthMiddleware
from django.core.asgi import get_asgi_application
# URLs that handle the WebSocket connection are placed here.
websocket_urlpatterns = [
    re_path(
        r"ws/notifications/", consumers.NotificationConsumer.as_asgi(),
    ),
 
]

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": TokenAuthMiddleware(
            URLRouter(
                websocket_urlpatterns
            )
        ),
    }
)
