from channels.generic.websocket import AsyncWebsocketConsumer
import json

from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer

from django.conf import settings
from .models import Notifications
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser

from posts.models import Posts
from django.contrib.auth import get_user_model
User = get_user_model()

from rest_framework_simplejwt.tokens import AccessToken

class NotificationConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        try:
            if(self.scope["user"].is_anonymous):
                await self.close()
            else:
                if not self.scope["user"].is_active:
                    await self.close()

                user = self.scope["user"]
                group_name = "user_%s" % user.id
                await self.channel_layer.group_add(
                    group_name,
                    self.channel_name,
                )
                await self.accept()

        except Exception as e:
            print(e)
            await self.close()

    
    async def disconnect(self, close_code):
        try:           
            user = self.scope["user"]
            group_name = "user_%s" % user.id
            await self.channel_layer.group_discard(group_name, self.channel_name)

        except Exception as e:
            print(e)

     # Receive message from room group.
    async def read_notification(self, event):
        message = event["message"]
        is_read = event["is_read"]
        await self.send(
            text_data=json.dumps(
                {
                    "is_read": is_read,
                    "message": message
                }
            )
        )

    # Receive message from room group.
    async def send_notification(self, event):
        message = event["message"]
        sender = event["sender"]
        notif_id = event["notif_id"]
        post = event["post"] or -1
        notification_type = event["notification_type"]
        #send message and username of sender to websocket
        await self.send(
            text_data=json.dumps(
                {
                    "notif_id": notif_id,
                    "message": message,
                    "sender": sender,
                    "post": post,
                    "notification_type": notification_type
                }
            )
        )

    pass