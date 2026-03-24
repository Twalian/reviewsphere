from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from catalog.models import Category, Product
from reviews.models import Review

User = get_user_model()

class ReviewRBACTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            username='admin_user', password='password123', role='ADMIN'
        )
        self.moderator_user = User.objects.create_user(
            username='mod_user', password='password123', role='MODERATOR'
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
            description="Great product!",
            status=Review.ReviewStatus.PENDING
        )
        self.product2 = Product.objects.create(
            name="Test Product 2", 
            category=self.category, 
            brand="Test Brand",
            price=15.0,
            status="available"
        )
        self.add_url = '/api/reviews/add/'
        self.product_reviews_url = f'/api/reviews/product/{self.product.id}/'
        self.my_reviews_url = '/api/reviews/list/'
        self.approve_url = f'/api/reviews/{self.review.id}/approve/'
        self.hide_url = f'/api/reviews/{self.review.id}/hide/'

    def test_client_can_add_review(self):
        self.client.force_authenticate(user=self.client_user)
        data = {
            "product": self.product2.id,
            "vote": 4,
            "description": "Nice!"
        }
        response = self.client.post(self.add_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_moderator_cannot_add_review(self):
        self.client.force_authenticate(user=self.moderator_user)
        data = {
            "product": self.product.id,
            "vote": 4,
            "description": "Nice!"
        }
        response = self.client.post(self.add_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_public_can_get_product_reviews_only_approved(self):
        # Case 1: Pending review should NOT be visible
        response = self.client.get(self.product_reviews_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        # Case 2: Approved review SHOULD be visible
        self.review.status = Review.ReviewStatus.APPROVED
        self.review.save()
        response = self.client.get(self.product_reviews_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


    def test_moderator_can_approve_review(self):
        self.client.force_authenticate(user=self.moderator_user)
        response = self.client.patch(self.approve_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.review.refresh_from_db()
        self.assertEqual(self.review.status, Review.ReviewStatus.APPROVED)

    def test_admin_can_hide_review(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(self.hide_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.review.refresh_from_db()
        self.assertEqual(self.review.status, Review.ReviewStatus.HIDDEN)

    def test_client_cannot_approve_review(self):
        self.client.force_authenticate(user=self.client_user)
        response = self.client.patch(self.approve_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
