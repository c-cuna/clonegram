"""
ASGI config for clonegram project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""


import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clonegram.settings')
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from notifications import routing

from django.urls import re_path, path

import notifications.routing

application = routing.application
