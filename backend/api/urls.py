from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # API root endpoint
    path('', views.api_root, name='api-root'),

    # Test endpoint
    path('test/', views.test_api, name='test-api'),

    # Role checking
    path('auth/check-role/', views.check_user_role, name='check-user-role'),

    # Authentication
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/me/', views.current_user, name='current-user'),  # Информация о текущем пользователе
    path('auth/refresh-token/', views.refresh_token, name='refresh-token'),  # Обновление токена

    # Standard Django Allauth registration with codes
    path('auth/register/', views.allauth_register, name='allauth-register'),  # Регистрация с кодом
    path('auth/verify-code/', views.verify_allauth_code, name='verify-allauth-code'),  # Проверка кода
    path('auth/check-email-status/', views.check_email_status, name='check-email-status'),  # Проверка статуса email
    path('auth/resend-confirmation/', views.resend_confirmation, name='resend-confirmation'),  # Повторная отправка подтверждения

    # Legacy code-based registration (deprecated)
    path('auth/send-code/', views.send_email_code, name='send-email-code'),  # Устаревший: Отправка кода
    path('auth/verify-code/', views.verify_email_code_step, name='verify-code-step'),  # Устаревший: Проверка кода
    path('auth/complete-profile/', views.complete_profile, name='complete-profile'),  # Устаревший: Создание профиля
    path('auth/resend-code/', views.resend_email_code, name='resend-email-code'),  # Устаревший: Повторная отправка кода

    # Posts
    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<uuid:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<uuid:post_id>/like/', views.toggle_like, name='toggle-like'),
    path('posts/<uuid:post_id>/view/', views.increment_views, name='increment-views'),

    # Comments
    path('posts/<uuid:post_id>/comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),

    # User Profile
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
]
