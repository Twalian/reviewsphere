from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from catalog.models import Category, Product
from reviews.models import Review

User = get_user_model()

class DashboardStatsTests(APITestCase):
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
        
        self.review = Review.objects.create(
            product=self.product,
            user=self.client_user,
            vote=5,
            title="Great product",
            description="I love it!",
            status=Review.ReviewStatus.APPROVED
        )
        
        self.url = '/api/dashboard-stats/'

    def test_admin_can_get_dashboard_stats_with_user_count(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('summary', response.data)
        self.assertIn('total_users', response.data['summary'])
        self.assertIn('total_products', response.data['summary'])
        self.assertIn('total_reviews', response.data['summary'])
        
        # Expected counts
        # 1 Admin + 1 Client = 2 Users
        self.assertEqual(response.data['summary']['total_users'], 2)
        self.assertEqual(response.data['summary']['total_products'], 1)
        self.assertEqual(response.data['summary']['total_reviews'], 1)

    def test_client_cannot_access_dashboard_stats(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
