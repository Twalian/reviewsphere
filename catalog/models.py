from django.db import models
from django.db.models import Avg


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name



class Product(models.Model):

    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('OUT_OF_STOCK', 'Out of Stock'),
        ('DISCONTINUED', 'Discontinued'),
    ]

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL, # se una categoria viene eliminata, i prodotti non vengono cancellati ma category diventa null.
        null=True,
        related_name='products'
    )
    brand = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='inactive'
    )
    
    # AI Caching fields
    ai_summary = models.JSONField(null=True, blank=True, help_text="Cached AI synthesis result")
    summary_last_updated = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self):
        return self.name
    
    @property                        # property/metodo custom
    def average_rating(self):
        result = self.reviews.filter(
            status='APPROVED'
        ).aggregate(avg=Avg('vote'))
        return round(result['avg'], 2) if result['avg'] else None


class ProductComparison(models.Model):
    """
    Cache for AI product comparison results.
    """
    products_hash = models.CharField(
        max_length=200,
        unique=True,
        help_text="Sorted, concatenated string of product IDs (e.g., '1-4-5')"
    )
    comparison_text = models.TextField(help_text="Cached comparison result with pros/cons")
    winner_recommendation = models.TextField(help_text="AI winner recommendation")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Product Comparison"
        verbose_name_plural = "Product Comparisons"

    def __str__(self):
        return f"Comparison: {self.products_hash}"
