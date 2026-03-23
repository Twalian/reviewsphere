from django.db import models
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Q, Count
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from users.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models.functions import TruncMonth
from reviews.models import Review
from rest_framework.views import APIView

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticatedOrReadOnly]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('id')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'status', 'brand']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticatedOrReadOnly]
        else:
            permission_classes = [IsAdmin]
        return [permission() for permission in permission_classes]

#TOP RATED
    @action(detail=False, methods=['get'], url_path='top-rated',
            permission_classes=[IsAdmin])
    def top_rated(self, request):
        top = Product.objects.annotate(
            avg_rating=Avg('reviews__vote',
                          filter=Q(reviews__status='APPROVED'))
        ).filter(avg_rating__isnull=False).order_by('-avg_rating')[:10]
        serializer = self.get_serializer(top, many=True)
        return Response(serializer.data)
    
# WORST RATED
    @action(detail=False, methods=['get'], url_path='worst-rated',
                permission_classes=[IsAdmin])
    def worst_rated(self, request):
        worst = Product.objects.annotate(
            avg_rating=Avg('reviews__vote',
                        filter=Q(reviews__status='APPROVED'))
        ).filter(avg_rating__isnull=False)\
        .order_by('avg_rating')[:10]  # ASCENDENTE (peggiori prima)
        serializer = self.get_serializer(worst, many=True)
        return Response(serializer.data)


"""Implementa statistica aggregata per Admin Dashboard:
    Trend recensioni mensili (TruncMonth + Count)
    Top 5 categorie più recensite (Count products__reviews)
    Alert rating < 2.5 (Avg + filter)
    Unified API endpoint /api/catalog/dashboard-stats/
"""

class DashboardStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        # Reviews trend per mese (solo APPROVED)
        trend = Review.objects.filter(
            status=Review.ReviewStatus.APPROVED
        ).annotate(
            month=TruncMonth('date')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')

        # Top 5 categorie più recensite
        top_categories = Category.objects.annotate(
            review_count=Count('products__reviews', 
                             filter=Q(products__reviews__status=Review.ReviewStatus.APPROVED),
                             distinct=True)
        ).order_by('-review_count')[:5]

        # Alert prodotti con rating medio < 2.5 (solo APPROVED)
        alerts = Product.objects.annotate(
            avg_rating=Avg('reviews__vote', 
                         filter=Q(reviews__status=Review.ReviewStatus.APPROVED))
        ).filter(avg_rating__lt=2.5).select_related('category')[:10]

        return Response({
            'trend': list(trend),
            'top_categories': list(top_categories.values('name', 'review_count')),
            'alerts': list(alerts.values('id', 'name', 'avg_rating', 'category__name')),
            'summary': {
                'total_reviews': Review.objects.filter(status=Review.ReviewStatus.APPROVED).count(),
                'total_products': Product.objects.count(),
                'categories': Category.objects.count()
            }
        })