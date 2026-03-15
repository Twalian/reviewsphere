from django.contrib import admin
from .models import Review

# Register your models here.
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('title', 'vote', 'product', 'description', 'date', 'status', 'user')
