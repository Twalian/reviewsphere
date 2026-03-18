from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAdminRBACTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin_user', password='password123', role='ADMIN', email='admin@example.com'
        )
        self.moderator_user = User.objects.create_user(
            username='mod_user', password='password123', role='MODERATOR', email='mod@example.com'
        )
        self.client_user = User.objects.create_user(
            username='client_user', password='password123', role='CLIENT', email='client@example.com'
        )
        # The basename is 'user' in the router probably, let's check users/urls.py
        self.list_url = '/api/users/admin/'

    def test_admin_can_list_users(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_moderator_cannot_list_users(self):
        self.client.force_authenticate(user=self.moderator_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_client_cannot_list_users(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_cannot_list_users(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
