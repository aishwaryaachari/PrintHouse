import os
import warnings
from django.contrib.auth import get_user_model
from django.db.utils import OperationalError, ProgrammingError, IntegrityError

def create_superuser_at_startup():
    """
    Automatically creates a superuser on application startup if none exists.
    Uses DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, and DJANGO_SUPERUSER_PASSWORD.
    """
    username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

    if not username or not password:
        print("Automatic superuser creation: skipped because DJANGO_SUPERUSER_USERNAME or DJANGO_SUPERUSER_PASSWORD is not set in environment.")
        return

    User = get_user_model()
    try:
        with warnings.catch_warnings():
            warnings.filterwarnings("ignore", category=RuntimeWarning, message="Accessing the database during app initialization")
            
            if not User.objects.filter(is_superuser=True).exists():
                if User.objects.filter(username=username).exists():
                    print(f"Automatic superuser creation: user '{username}' already exists but is not a superuser. Upgrading to superuser...")
                    user = User.objects.get(username=username)
                    user.is_superuser = True
                    user.is_staff = True
                    user.set_password(password)
                    user.save()
                    print(f"Automatic superuser creation: user '{username}' successfully upgraded to superuser.")
                else:
                    print(f"Automatic superuser creation: no superuser exists. Creating '{username}'...")
                    User.objects.create_superuser(username=username, email=email or '', password=password)
                    print(f"Automatic superuser creation: superuser '{username}' successfully created.")
            else:
                print("Automatic superuser creation: a superuser already exists. Skipping.")
    except (OperationalError, ProgrammingError) as e:
        print(f"Automatic superuser creation: database is not ready or not migrated yet. Skipping: {e}")
    except IntegrityError as e:
        print(f"Automatic superuser creation: database integrity error (possibly due to concurrent creation). Skipping: {e}")
    except Exception as e:
        print(f"Automatic superuser creation: unexpected error: {e}")
