from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import IntegrityError
from django.shortcuts import get_object_or_404

from catalog.models import Product
from reviews.models import Review
from reviews.serializers import ReviewCreateSerializer, ReviewListSerializer
from users.permissions import IsClient, IsModeratorOrAdmin


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsClient])
def add_review(request):

    serializer = ReviewCreateSerializer(data=request.data)

    if serializer.is_valid():
        try:
            review = serializer.save(user=request.user)

            return Response(
            ReviewListSerializer(review).data,
            status=status.HTTP_201_CREATED)


        except IntegrityError:
            return Response(
                {"error": "Hai già recensito questo prodotto"},
                status=status.HTTP_409_CONFLICT
            )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
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


# Moderation endpoints - accessible to Moderator and Admin
@api_view(["PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsModeratorOrAdmin])
def approve_review(request, review_id):
    """Approve a review - makes it visible to all users."""
    review = get_object_or_404(Review, id=review_id)
    review.status = Review.ReviewStatus.APPROVED
    review.save()
    return Response(
        ReviewListSerializer(review).data,
        status=status.HTTP_200_OK
    )


@api_view(["PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated, IsModeratorOrAdmin])
def hide_review(request, review_id):
    """Hide a review - hides it from public view."""
    review = get_object_or_404(Review, id=review_id)
    review.status = Review.ReviewStatus.HIDDEN
    review.save()
    return Response(
        ReviewListSerializer(review).data,
        status=status.HTTP_200_OK
    )