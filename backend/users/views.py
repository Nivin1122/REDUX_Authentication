from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializers
from rest_framework.permissions import IsAuthenticated,AllowAny

from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import permission_classes

from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [AllowAny]


@csrf_exempt
def admin_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None and user.is_staff:  # Check if user is an admin
            login(request, user)
            return JsonResponse({'message': 'Admin login successful'}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials or not an admin'}, status=401)
    return JsonResponse({'error': 'Invalid request method'}, status=400)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_users(request):
    users = User.objects.all()
    users_data = [
        {"id": user.id, "username": user.username, "email": user.email}
        for user in users
    ]
    return Response(users_data)