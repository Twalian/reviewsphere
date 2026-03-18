from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from catalog.models import Category, Product

User = get_user_model()

class CatalogRBACTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin_user', password='password123', role='ADMIN'
        )
        self.client_user = User.objects.create_user(
            username='client_user', password='password123', role='CLIENT'
        )
        self.category = Category.objects.create(name="Test Category")
        self.product = Product.objects.create(
            name="Test Product", 
            category=self.category, 
            brand="Test Brand",
            price=10.0,
            status="available"
        )
        self.category_list_url = '/api/categories/'
        self.product_list_url = '/api/products/'

    def test_client_can_list_categories(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(self.category_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_client_cannot_create_category(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.post(self.category_list_url, {"name": "New Cat"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_category(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(self.category_list_url, {"name": "Admin Cat"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_client_can_list_products(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(self.product_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_client_cannot_create_product(self):
        self.client.force_authenticate(user=self.client_user)
        data = {
            "name": "New Prod", 
            "category": self.category.id, 
            "brand": "New Brand",
            "price": 20.0,
            "status": "available"
        }
        response = self.client.post(self.product_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_product(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "name": "Admin Prod", 
            "category": self.category.id, 
            "brand": "Admin Brand",
            "price": 20.0,
            "status": "available"
        }
        response = self.client.post(self.product_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
