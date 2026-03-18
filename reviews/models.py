from django.db import models
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Review(models.Model):
    class ReviewStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        HIDDEN = 'HIDDEN', 'Hidden'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title=models.CharField(max_length=100,blank=True)
    vote = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )

    description=models.TextField(max_length=2000)
    date = models.DateTimeField(auto_now_add=True)

    status = models.CharField(
        max_length=10,
        choices=ReviewStatus.choices,
        default=ReviewStatus.PENDING
    )

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    product = models.ForeignKey(
        "catalog.Product",
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    # CAMPi AI
    sentiment = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        help_text="Risultato analisi AI: positive, negative, neutral"
    )
    pros = models.JSONField(default=list, blank=True, help_text="Elenco dei pro generati dall'AI")
    cons = models.JSONField(default=list, blank=True, help_text="Elenco dei contro generati dall'AI")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product"],
                name="unique_user_product_review"
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.product} ({self.vote})"
    