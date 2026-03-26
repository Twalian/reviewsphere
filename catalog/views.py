from django.db import models
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Q, Count
from .models import Category, Product, ProductComparison
from .serializers import CategorySerializer, ProductSerializer
from users.permissions import IsAdmin
from django.db.models.functions import TruncMonth
from reviews.models import Review
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from reviews.ai_providers import get_ai_provider, AIProviderError
from django.contrib.auth import get_user_model

User = get_user_model()

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
        elif self.action == 'compare':
            permission_classes = [IsAuthenticated]
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

    @action(detail=False, methods=['post'], url_path='compare',
            permission_classes=[IsAuthenticated])
    def compare(self, request):
        """
        Compare multiple products using AI.
        Expected body: {"product_ids": [id1, id2, ...]}
        """
        product_ids = request.data.get("product_ids", [])
        if len(product_ids) < 2:
            return Response(
                {"error": "Fornisci almeno due ID prodotto per il confronto"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create products hash for caching
        sorted_ids = sorted([str(id) for id in product_ids])
        products_hash = "-".join(sorted_ids)

        # Check cache first
        cached = ProductComparison.objects.filter(products_hash=products_hash).first()
        if cached:
            return Response({
                "comparison": cached.comparison_text,
                "winner_recommendation": cached.winner_recommendation,
                "cached": True
            }, status=status.HTTP_200_OK)

        products = Product.objects.filter(id__in=product_ids).prefetch_related('reviews')
        if not products.exists():
            return Response({"error": "Nessun prodotto trovato"}, status=status.HTTP_404_NOT_FOUND)

        try:
            provider = get_ai_provider()
            products_data = []

            for product in products:
                # Aggregate reviews for synthesis
                approved_reviews = product.reviews.filter(status='APPROVED')
                reviews_list = [
                    {"title": r.title, "description": r.description, "vote": r.vote} 
                    for r in approved_reviews
                ]

                # 1. Synthesize individual product reviews
                if reviews_list:
                    synthesis = provider.synthesize_reviews(reviews_list)
                    ai_summary = synthesis.summary
                else:
                    ai_summary = "Nessuna recensione disponibile."

                products_data.append({
                    "name": product.name,
                    "avg_rating": product.average_rating,
                    "ai_summary": ai_summary
                })

            # 2. Compare the synthesized data
            comparison_result = provider.compare_products(products_data)

            # Cache the result
            ProductComparison.objects.create(
                products_hash=products_hash,
                comparison_text=comparison_result.comparison,
                winner_recommendation=comparison_result.winner_recommendation
            )

            return Response({
                "comparison": comparison_result.comparison,
                "winner_recommendation": comparison_result.winner_recommendation
            }, status=status.HTTP_200_OK)

        except AIProviderError as e:
            return Response({"error": str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            return Response(
                {"error": "Errore interno durante il confronto"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
                
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
                'total_users': User.objects.count(),
                'categories': Category.objects.count()
            }
        })