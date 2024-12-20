from django.urls import path,include
from .views import admin_login,get_all_users,delete_user,UserProfileView

urlpatterns = [
    path('admin-login/', admin_login, name='admin-login'),
    path('all-users/', get_all_users, name='get-all-users'),
    path('delete-user/<int:user_id>/', delete_user, name='delete-user'),
    path('user/profile/',UserProfileView.as_view(),name='user_profile'),
    path('user/profile/update/', UserProfileView.as_view(), name='user_profile_update'),
]
