import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SymposiumTimer.settings')

django_app = get_asgi_application()


async def application(scope, receive, send):
    if scope['type'] == 'http':
        # Let Django handle HTTP
        await django_app(scope, receive, send)
    elif scope['type'] == 'websocket':
        await display_websocket_app(scope, receive, send)
    else:
        raise NotImplementedError(f"Unknown scope type {scope['type']}.")


async def display_websocket_app(scope, receive, send):
    # TODO: figure out how to connect to a custom daemon.
    pass
