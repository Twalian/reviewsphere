from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Q
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from rest_framework.permissions import IsAdminUser

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticatedOrReadOnly]
        else:
            permission_classes=[IsAdminUser]
        return [permission() for permission in permission_classes]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('id')
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'status', 'brand']

#TOP RATED
    @action(detail=False, methods=['get'], url_path='top-rated',
            permission_classes=[IsAdminUser])
    def top_rated(self, request):
        top = Product.objects.annotate(
            avg_rating=Avg('reviews__vote',
                          filter=Q(reviews__status='APPROVED'))
        ).filter(avg_rating__isnull=False).order_by('-avg_rating')[:10]
        serializer = self.get_serializer(top, many=True)
        return Response(serializer.data)
    
# WORST RATED
    @action(detail=False, methods=['get'], url_path='worst-rated',
                permission_classes=[IsAdminUser])
    def worst_rated(self, request):
        worst = Product.objects.annotate(
            avg_rating=Avg('reviews__vote',
                        filter=Q(reviews__status='APPROVED'))
        ).filter(avg_rating__isnull=False)\
        .order_by('avg_rating')[:10]  # ASCENDENTE (peggiori prima)
        serializer = self.get_serializer(worst, many=True)
        return Response(serializer.data)
