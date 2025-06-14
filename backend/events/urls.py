from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    # События
    path('', views.EventListCreateView.as_view(), name='event-list-create'),
    path('<uuid:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    
    # Участие в событиях
    path('<uuid:event_id>/join/', views.join_event, name='join-event'),
    path('<uuid:event_id>/leave/', views.leave_event, name='leave-event'),
    
    # Отзывы на события
    path('<uuid:event_id>/reviews/', views.EventReviewListCreateView.as_view(), name='event-reviews'),
    
    # Создание события из поста
    path('create-from-post/', views.create_event_from_post, name='create-from-post'),
    
    # Календарь событий
    path('calendar/', views.calendar_events, name='calendar-events'),
]
