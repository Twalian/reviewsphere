from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class RoleChoices(models.TextChoices):
        CLIENT = 'CLIENT', 'Cliente'
        MODERATOR = 'MODERATOR', 'Moderatore'
        ADMIN = 'ADMIN', 'Amministratore'

    role = models.CharField(
        max_length=20,
        choices=RoleChoices.choices,
        default=RoleChoices.CLIENT,
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
