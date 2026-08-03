from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer, ResetPasswordSerializer
from django.db.models import Q

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User registered successfully. Awaiting admin approval."},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

class UserUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User updated successfully"},
                status=status.HTTP_200_OK
            )
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        data = serializer.data
        data['is_approved'] = user.status == 'approved'
        return Response(data, status=status.HTTP_200_OK)

class CheckDuplicateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        email = request.query_params.get('email')
        username = request.query_params.get('username')
        if email:
            exists = CustomUser.objects.filter(email=email).exists()
            return Response({"exists": exists}, status=status.HTTP_200_OK)
        if username:
            exists = CustomUser.objects.filter(username=username).exists()
            return Response({"exists": exists}, status=status.HTTP_200_OK)
        return Response(
            {"error": "Provide email or username"},
            status=status.HTTP_400_BAD_REQUEST
        )

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier'].lower()
            password = serializer.validated_data['password']
            user = authenticate(request, username=identifier, password=password)
            if user is None:
                try:
                    user_obj = CustomUser.objects.get(email=identifier)
                    user = authenticate(request, username=user_obj.username, password=password)
                except CustomUser.DoesNotExist:
                    pass
            if user:
                if not user.is_active:
                    return Response(
                        {"error": "Account is not active."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                        'username': user.username,
                    },
                    status=status.HTTP_200_OK
                )
            return Response(
                {"error": "Invalid credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier'].lower()
            security_answer = serializer.validated_data['security_answer']
            new_password = serializer.validated_data['new_password']
            try:
                user = CustomUser.objects.filter(Q(email=identifier) | Q(username=identifier)).first()
                if not user:
                    return Response(
                        {"error": "User not found."},
                        status=status.HTTP_404_NOT_FOUND
                    )
                if user.profile.security_answer != security_answer:
                    return Response(
                        {"error": "Incorrect security answer."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                user.set_password(new_password)
                user.save()
                return Response(
                    {"message": "Password reset successfully."},
                    status=status.HTTP_200_OK
                )
            except CustomUser.DoesNotExist:
                return Response(
                    {"error": "User not found."},
                    status=status.HTTP_404_NOT_FOUND
                )
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

class UserApprovalView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
            new_status = request.data.get('status')
            if new_status not in ['pending', 'approved', 'rejected']:
                return Response(
                    {"error": "Invalid status. Must be 'pending', 'approved', or 'rejected'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if user.status == new_status:
                return Response(
                    {"message": f"User status is already {new_status}."},
                    status=status.HTTP_200_OK
                )
            user.status = new_status
            user.save()
            serializer = UserSerializer(user)
            data = serializer.data
            data['is_approved'] = user.status == 'approved'
            return Response(
                {
                    "message": f"User status updated to {new_status}.",
                    "user": data
                },
                status=status.HTTP_200_OK
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
class UserListView(APIView):
    permission_classes = [IsAdminUser]  # Only admins can list all users

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User registered successfully. Awaiting admin approval."},
                status=status.HTTP_201_CREATED
            )
        return Response(
            {"errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )