from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profiles'
    fieldsets = (
        ('Personal Info', {'fields': ('first_name', 'last_name', 'organization', 'designation', 'department', 'mobile', 'address')}),
        ('Security', {'fields': ('security_question', 'security_answer')}),
    )

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    inlines = [ProfileInline]
    list_display = ('email', 'username', 'get_first_name', 'get_last_name', 'get_organization', 'get_mobile', 'get_status', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('email', 'username', 'profile__first_name', 'profile__last_name', 'profile__organization', 'profile__mobile')
    list_filter = ('status', 'is_active', 'is_staff')
    readonly_fields = ('date_joined',)
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('date_joined',)}),
        ('Status', {'fields': ('status',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'status', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )
    ordering = ['email']
    filter_horizontal = ('groups', 'user_permissions')

    def get_first_name(self, obj):
        return obj.profile.first_name if hasattr(obj, 'profile') else ''
    get_first_name.short_description = 'First Name'

    def get_last_name(self, obj):
        return obj.profile.last_name if hasattr(obj, 'profile') else ''
    get_last_name.short_description = 'Last Name'

    def get_organization(self, obj):
        return obj.profile.organization if hasattr(obj, 'profile') else ''
    get_organization.short_description = 'Organization'

    def get_mobile(self, obj):
        return obj.profile.mobile if hasattr(obj, 'profile') else ''
    get_mobile.short_description = 'Mobile'

    def get_status(self, obj):
        return obj.get_status_display()
    get_status.short_description = 'Status'