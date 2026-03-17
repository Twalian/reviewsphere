from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db import IntegrityError
from django.shortcuts import get_object_or_404

from catalog.models import Product
from reviews.models import Review
from reviews.serializers import ReviewCreateSerializer, ReviewListSerializer


# Funzioni placeholder AI
def analyze_sentiment(text):
    text_lower = text.lower()
    if any(w in text_lower for w in ["ottimo", "buono", "fantastico", "perfetto"]):
        return "positive"
    elif any(w in text_lower for w in ["pessimo", "scarso", "deludente"]):
        return "negative"
    else:
        return "neutral"

def extract_pros_cons(text):
    pros, cons = [], []
    if "ottimo" in text.lower():
        pros.append("Qualità")
    if "pessimo" in text.lower():
        cons.append("Esperienza negativa")
    return pros, cons


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_review(request):

    serializer = ReviewCreateSerializer(data=request.data)

    if serializer.is_valid():
        try:
            review = serializer.save(user=request.user)
            # calcolo AI (sentiment e pros/cons)
            sentiment = analyze_sentiment(review.description)
            pros, cons = extract_pros_cons(review.description)

            # aggiorno i campi AI
            review.sentiment = sentiment
            review.pros = pros
            review.cons = cons
            review.save()  # salvo le modifiche


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