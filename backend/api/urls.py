from django.urls import path
from . import views

app_name = 'api'

urlpatterns = [
    # Authentication
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/logout/', views.logout_view, name='logout'),

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
