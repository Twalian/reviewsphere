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
        ('available', 'Available'),
        ('inactive', 'Inactive'), # un prodotto significa che è stato creato ma non è ancora visibile al pubblico
        ('out_of_order', 'Out of Order'),
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
    
"""@property significa che average_rating si usa come se fosse un campo (product.average_rating) ma in realtà è un metodo che calcola
il valore al volo interrogando il DB — per questo non richiede migrazione."""



