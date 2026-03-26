from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'category',
            'brand',
            'price',
            'image_url',
            'status',
            'average_rating'
        ]
