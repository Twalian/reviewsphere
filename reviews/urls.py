from . import views
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("", views.add_review, name="Create Review"),
    path("", views.get_reviews_by_product, name="Review_by_product"),
    path("", views.get_reviews_list, name="get_reviews_list"),
]