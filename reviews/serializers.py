from rest_framework import serializers
from reviews.models import Review


class ReviewSerializerList(serializers.ModelSerializer):

    username = serializers.CharField(source="user.username", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "title",
            "vote",
            "username",
            "product_name",
            "description",
            "date",
            "status",
        ]


class ReviewSerializerCreate(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "title",
            "vote",
            "description",
            "product"
        ]

        