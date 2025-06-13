from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, TeacherEmail


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'faculty', 'department', 'created_at']
    list_filter = ['created_at', 'role', 'faculty', 'department']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name', 'bio']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'role', 'avatar', 'bio', 'birth_date')
        }),
        ('Для студентов', {
            'fields': ('faculty', 'group', 'course'),
            'classes': ('collapse',)
        }),
        ('Для преподавателей', {
            'fields': ('department', 'position'),
            'classes': ('collapse',)
        }),
        ('Системная информация', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(TeacherEmail)
class TeacherEmailAdmin(admin.ModelAdmin):
    list_display = ['email', 'department', 'position', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'department']
    search_fields = ['email', 'department', 'position']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Email преподавателя', {
            'fields': ('email', 'is_active')
        }),
        ('Информация о преподавателе', {
            'fields': ('department', 'position')
        }),
        ('Системная информация', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
