from django.contrib.auth.backends import ModelBackend
from django.db import models
from .models import CustomUser

class CustomAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = CustomUser.objects.get(
                models.Q(email=username) | models.Q(username=username)
            )
            if user.check_password(password) and user.status == 'approved':
                return user
        except CustomUser.DoesNotExist:
            return None
        return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomUser.DoesNotExist:
            return None