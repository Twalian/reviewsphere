from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Q
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from users.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from reviews.ai_providers import get_ai_provider, AIProviderError

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
