from rest_framework import serializers
from .models import CustomUser, Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'organization', 'designation', 'department', 'mobile', 'address', 'security_question', 'security_answer']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    is_approved = serializers.SerializerMethodField()  # Add is_approved for frontend compatibility

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'password', 'confirm_password', 'status', 'is_active', 'is_staff', 'date_joined', 'profile', 'is_approved']
        read_only_fields = ['id', 'date_joined', 'is_active', 'is_staff']
        extra_kwargs = {
            'status': {'read_only': True},  # Status is read-only except for admins
        }

    def get_is_approved(self, obj):
        return obj.status == 'approved'  # Map status to is_approved for frontend

    def validate(self, data):
        # Validate required fields
        required_fields = ['email', 'password', 'confirm_password']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: f"{field.capitalize()} is required."})

        # Validate password matching
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        # Validate profile fields
        profile_data = data.get('profile', {})
        required_profile_fields = ['first_name', 'last_name', 'organization', 'designation', 'department', 'mobile', 'address', 'security_answer']
        for field in required_profile_fields:
            if not profile_data.get(field):
                raise serializers.ValidationError({f"profile.{field}": f"{field.capitalize()} is required."})

        # Validate email format
        if not serializers.EmailField().to_internal_value(data['email']):
            raise serializers.ValidationError({"email": "Invalid email format."})

        # Validate mobile number (10 digits)
        if not profile_data.get('mobile', '').isdigit() or len(profile_data.get('mobile', '')) != 10:
            raise serializers.ValidationError({"profile.mobile": "Mobile number must be 10 digits."})

        return data

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username', ''),
            password=validated_data['password'],
            status='pending',  # Default to pending for new users
        )
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)
        validated_data.pop('confirm_password', None)
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        # Only admins can update status (handled in UserApprovalView)
        if validated_data.get('password'):
            instance.set_password(validated_data['password'])
        instance.save()

        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()

        return instance

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if not data.get('identifier'):
            raise serializers.ValidationError({"identifier": "Identifier is required."})
        if not data.get('password'):
            raise serializers.ValidationError({"password": "Password is required."})
        return data

class ResetPasswordSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    security_answer = serializers.CharField(required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        if not data.get('identifier'):
            raise serializers.ValidationError({"identifier": "Identifier is required."})
        if not data.get('security_answer'):
            raise serializers.ValidationError({"security_answer": "Security answer is required."})
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data