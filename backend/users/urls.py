from django.urls import path,include
from .views import admin_login

urlpatterns = [
    path('admin-login/', admin_login, name='admin-login'),
]
