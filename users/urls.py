from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .views import RegisterView, MeView, UserAdminViewSet

router = SimpleRouter()
router.register(r'admin', UserAdminViewSet, basename='user-admin')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', MeView.as_view(), name='auth_me'),
    path('', include(router.urls)),
]
