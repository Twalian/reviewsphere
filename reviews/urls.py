from . import views
from django.contrib import admin
from django.urls import path


urlpatterns = [
    path("add/", views.add_review, name="Create Review"),
    path("product/<int:product_id>/", views.get_reviews_by_product, name="Review_by_product"),
    path("list/", views.get_reviews_list, name="get_reviews_list"),
]