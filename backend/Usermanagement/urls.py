from django.urls import path
from .views import (
    UserRegistrationView,
    UserUpdateView,
    UserDetailView,
    CheckDuplicateView,
    LoginView,
    ResetPasswordView,
    UserApprovalView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('users/', UserRegistrationView.as_view(), name='user-registration'),
    path('users/<int:pk>/', UserUpdateView.as_view(), name='user-update'),
    path('users/me/', UserDetailView.as_view(), name='user-detail'),
    path('users/check-duplicate/', CheckDuplicateView.as_view(), name='check-duplicate'),
    path('login/', LoginView.as_view(), name='login'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/<int:user_id>/approve/', UserApprovalView.as_view(), name='user-approve'),
]