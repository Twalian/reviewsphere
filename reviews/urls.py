from . import views
from django.contrib import admin
from django.urls import path


urlpatterns = [
    path("add/", views.add_review, name="Create Review"),
    path("product/<int:product_id>/", views.get_reviews_by_product, name="Review_by_product"),
    path("mine/", views.get_reviews_list, name="get_reviews_list"),
    path("<int:product_id>/ai-summary/", views.get_product_AI_summary, name="Get_product_AI_summary"),
    path("<uuid:review_id>/update/",views.update_reviews),
    path("<uuid:review_id>/delete/", views.delete_reviews),
    # Moderation endpoints
    path("<uuid:review_id>/approve/", views.approve_review, name="approve_review"),
    path("<uuid:review_id>/hide/", views.hide_review, name="hide_review"),
    path("<uuid:review_id>/report/", views.report_review, name='report-review'),
    path("reports/", views.ModeratorReportListView.as_view(), name="report-list"),
    path("reports/<int:report_id>/resolve/", views.resolve_report, name="resolve-report"),
    path("<uuid:review_id>/toggle-helpful/", views.toggle_review_helpful, name="toggle_helpful"),
]
