from rest_framework import serializers
from reviews.models import Review


class ReviewListSerializer(serializers.ModelSerializer):

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
            "sentiment",   # nuovo campo
            "pros",        # nuovo campo
            "cons",        # nuovo campo
        ]


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            "title",
            "vote",
            "description",
            "product"
        ]
    def validate_vote(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Il voto deve essere tra 1 e 5.")
        return value

        