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
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework import status
from django.contrib.auth import get_user_model
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

        if user is not None and user.is_staff:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': 'Admin login successful',
                'refresh': str(refresh), 
                'access': str(refresh.access_token),
                'is_staff': user.is_staff
            }, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials or not an admin'}, status=401)
    return JsonResponse({'error': 'Invalid request method'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    users = User.objects.all()
    users_data = [
        {"id": user.id, "username": user.username, "email": user.email}
        for user in users
    ]
    return Response(users_data)


User = get_user_model()

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            profile_data = {
                'username': user.username,
                'email': user.email,
            }
            return Response(profile_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'detail': 'Error retrieving profile'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request):
        try:
            user = request.user
            data = request.data
            user.username = data.get("username", user.username)
            user.email = data.get("email", user.email)

            user.save()

            return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'detail': 'Error updating profile'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['DELETE'])
@permission_classes([AllowAny]) 
def delete_user(request, user_id):
    # Check if the user is admin
    # if not request.user.is_staff:
    #     return Response(
    #         {'error': 'Only admin users can delete users'}, 
    #         status=status.HTTP_403_FORBIDDEN
    #     )
        
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)