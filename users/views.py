from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, UserSerializer

# Create your views here.

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
