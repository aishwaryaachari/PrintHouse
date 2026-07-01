"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from pathlib import Path

def load_env():
    env_path = Path(__file__).resolve().parent / '.env'
    if not env_path.exists():
        env_path = Path(__file__).resolve().parent.parent / '.env'
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    try:
                        key, val = line.split('=', 1)
                        os.environ[key.strip()] = val.strip().strip("'\"")
                    except ValueError:
                        pass

load_env()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from django.core.asgi import get_asgi_application
application = get_asgi_application()
