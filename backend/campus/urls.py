from django.urls import path
from . import views

app_name = 'campus'

urlpatterns = [
    # Корпуса
    path('buildings/', views.BuildingListView.as_view(), name='building-list'),
    path('buildings/<uuid:pk>/', views.BuildingDetailView.as_view(), name='building-detail'),
    path('buildings/<uuid:building_id>/statistics/', views.building_statistics, name='building-statistics'),
    
    # Аудитории
    path('rooms/', views.RoomListView.as_view(), name='room-list'),
    path('rooms/<uuid:pk>/', views.RoomDetailView.as_view(), name='room-detail'),
    path('rooms/<uuid:room_id>/statistics/', views.room_statistics, name='room-statistics'),
    
    # Отзывы об аудиториях
    path('rooms/<uuid:room_id>/reviews/', views.RoomReviewListCreateView.as_view(), name='room-reviews'),
    path('reviews/<uuid:pk>/', views.RoomReviewDetailView.as_view(), name='review-detail'),
]
