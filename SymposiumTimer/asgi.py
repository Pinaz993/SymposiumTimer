"""
ASGI config for SymposiumTimer project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SymposiumTimer.settings')

django_app = get_asgi_application()


async def application(scope, receive, send):
    if scope['type'] == 'http':
        # Let Django handle HTTP
        await django_app(scope, receive, send)
    elif scope['type'] == 'websocket':
        await websocket_app(scope, receive, send)
    else:
        raise NotImplementedError(f"Unknown scope type {scope['type']}.")


async def websocket_app(scope, receive, send):
    while True:
        event = await receive()

        if event['type'] == 'websocket.connect':  # incoming new connection
            await send({
                'type': 'websocket.accept'
            })

        if event['type'] == 'websocket.disconnect':  # just like it sounds.
            break

        if event['type'] == 'websocket.receive':  # client just sent us something
            if event['text'] == 'ping':
                await send({
                    'type': 'websocket.send',
                    'text': 'pong'
                })
