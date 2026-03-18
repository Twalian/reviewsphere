from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import IntegrityError
from django.shortcuts import get_object_or_404

from catalog.models import Product
from reviews.models import Review
from reviews.serializers import ReviewCreateSerializer, ReviewListSerializer,  ReviewUpdateSerializer

from reviews.ai_providers import get_ai_provider, AIProviderError

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_review(request):

    serializer = ReviewCreateSerializer(data=request.data)

    if serializer.is_valid():
        try:
            review = serializer.save(user=request.user)
            # calcolo AI (sentiment e pros/cons)
            provider = get_ai_provider()
            sentiment_result = provider.analyze_sentiment(review.description)
            review.sentiment = sentiment_result.sentiment
            review.save()  

        except AIProviderError:
            pass

        except IntegrityError:
            return Response(
                {"error": "Hai già recensito questo prodotto"},
                status=status.HTTP_409_CONFLICT
            )

        return Response(
            ReviewListSerializer(review).data,
            status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_reviews(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    if request.user != review.user:
             return Response({"error": "Non autorizzato"}, status=status.HTTP_403_FORBIDDEN)

    serializer = ReviewUpdateSerializer(review, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        try:          
            provider = get_ai_provider()
            sentiment_result = provider.analyze_sentiment(review.description)
            review.sentiment = sentiment_result.sentiment
            review.save()  

        except AIProviderError:
            pass

        return Response(
            ReviewListSerializer(review).data,
            status=status.HTTP_202_ACCEPTED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_reviews(request, review_id):
    review = get_object_or_404(Review, id=review_id)
    if request.user != review.user and request.user.role != 'ADMIN':
        return Response({"error": "Non autorizzato"}, status=status.HTTP_403_FORBIDDEN)

    review.delete()

    return Response(
            status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_reviews_by_product(request, product_id):

    product = get_object_or_404(Product, id=product_id)

    reviews = (
        Review.objects
        .filter(product=product)
        .select_related("user", "product")
    )

    serializer = ReviewListSerializer(reviews, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_reviews_list(request):
    reviews = (
        Review.objects
        .filter(user=request.user)
        .select_related("user", "product")
    )

    serializer = ReviewListSerializer(reviews, many=True)

    return Response(serializer.data)



@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_product_AI_summary(request, product_id):
    product = get_object_or_404(Product, id=product_id)

    reviews = (
        Review.objects
        .filter(product=product, status=Review.ReviewStatus.APPROVED)
        .select_related("user", "product")
    )
    lista: dict= [{"title": review.title, "description": review.description, "vote": review.vote} for review in reviews]
    if not lista:
        return Response({"error": "Nessuna recensione approvata per questo prodotto"}, status=status.HTTP_404_NOT_FOUND)
    try:
        provider = get_ai_provider()          # 1. ottengo il provider
        result=provider.synthesize_reviews(lista)        # 2. chiamo il metodo giusto


    except AIProviderError:
        return Response(
                {"error": "Servizio non disponibile"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        
    return Response({                     
    "summary": result.summary,
    "pros": result.pros,
    "cons": result.cons}, status=status.HTTP_200_OK)