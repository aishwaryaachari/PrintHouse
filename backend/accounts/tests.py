import os
from unittest import mock
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError
from .utils import create_superuser_at_startup

User = get_user_model()

class AutomaticSuperuserTestCase(TestCase):
    def setUp(self):
        # Clear out users to ensure a clean state
        User.objects.all().delete()

    @mock.patch.dict(os.environ, {
        'DJANGO_SUPERUSER_USERNAME': 'testadmin',
        'DJANGO_SUPERUSER_EMAIL': 'testadmin@example.com',
        'DJANGO_SUPERUSER_PASSWORD': 'testpassword123'
    })
    def test_creates_superuser_when_none_exists(self):
        # Verify no superusers exist
        self.assertFalse(User.objects.filter(is_superuser=True).exists())

        # Call the startup function
        create_superuser_at_startup()

        # Check that the superuser was created
        superuser = User.objects.filter(is_superuser=True).first()
        self.assertIsNotNone(superuser)
        self.assertEqual(superuser.username, 'testadmin')
        self.assertEqual(superuser.email, 'testadmin@example.com')
        self.assertTrue(superuser.check_password('testpassword123'))
        self.assertTrue(superuser.is_staff)

    @mock.patch.dict(os.environ, {
        'DJANGO_SUPERUSER_USERNAME': 'testadmin',
        'DJANGO_SUPERUSER_EMAIL': 'testadmin@example.com',
        'DJANGO_SUPERUSER_PASSWORD': 'testpassword123'
    })
    def test_upgrades_existing_non_superuser_with_same_username(self):
        # Pre-create a regular user with the target username
        regular_user = User.objects.create_user(
            username='testadmin',
            email='oldemail@example.com',
            password='oldpassword'
        )
        self.assertFalse(regular_user.is_superuser)
        self.assertFalse(regular_user.is_staff)

        # Call the startup function
        create_superuser_at_startup()

        # Verify the user was upgraded to a superuser and settings/password updated
        upgraded_user = User.objects.get(username='testadmin')
        self.assertTrue(upgraded_user.is_superuser)
        self.assertTrue(upgraded_user.is_staff)
        self.assertTrue(upgraded_user.check_password('testpassword123'))

    @mock.patch.dict(os.environ, {
        'DJANGO_SUPERUSER_USERNAME': 'newadmin',
        'DJANGO_SUPERUSER_EMAIL': 'newadmin@example.com',
        'DJANGO_SUPERUSER_PASSWORD': 'newpassword123'
    })
    def test_skips_creation_if_superuser_already_exists(self):
        # Create an existing superuser with a different username
        existing_superuser = User.objects.create_superuser(
            username='existingadmin',
            email='existing@example.com',
            password='existingpassword'
        )
        self.assertTrue(User.objects.filter(is_superuser=True).exists())

        # Call the startup function
        create_superuser_at_startup()

        # Verify that the new superuser was NOT created because a superuser already exists
        self.assertFalse(User.objects.filter(username='newadmin').exists())
        self.assertEqual(User.objects.filter(is_superuser=True).count(), 1)

    @mock.patch.dict(os.environ, {})
    def test_skips_creation_if_env_variables_not_set(self):
        # Call the startup function
        create_superuser_at_startup()

        # Verify no users were created
        self.assertEqual(User.objects.count(), 0)
