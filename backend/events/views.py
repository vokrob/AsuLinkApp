from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import models
from .models import Event, EventParticipant, EventReview
from .serializers import (
    EventListSerializer, EventDetailSerializer, EventReviewSerializer,
    EventCreateFromPostSerializer, EventParticipantSerializer
)


class EventListCreateView(generics.ListCreateAPIView):
    """Список событий и создание нового события"""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventDetailSerializer
        return EventListSerializer

    def get_queryset(self):
        queryset = Event.objects.filter(is_public=True)

        # Фильтрация по категории
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        # Фильтрация по дате
        date_filter = self.request.query_params.get('date')
        if date_filter == 'today':
            today = timezone.now().date()
            queryset = queryset.filter(start_datetime__date=today)
        elif date_filter == 'upcoming':
            queryset = queryset.filter(start_datetime__gte=timezone.now())
        elif date_filter == 'past':
            queryset = queryset.filter(start_datetime__lt=timezone.now())

        # Фильтрация по месяцу и году для календаря
        year = self.request.query_params.get('year')
        month = self.request.query_params.get('month')
        if year and month:
            queryset = queryset.filter(
                start_datetime__year=int(year),
                start_datetime__month=int(month)
            )

        # Мои события (где пользователь организатор или участник)
        my_events = self.request.query_params.get('my_events')
        if my_events == 'true':
            user = self.request.user
            queryset = queryset.filter(
                models.Q(organizer=user) | models.Q(participants=user)
            ).distinct()

        return queryset.order_by('start_datetime')


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Детальная информация о событии"""
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """Только организатор может изменять/удалять событие"""
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsEventOrganizerOrReadOnly()]
        return [permissions.IsAuthenticated()]


class EventReviewListCreateView(generics.ListCreateAPIView):
    """Отзывы на событие"""
    serializer_class = EventReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return EventReview.objects.filter(event_id=event_id)

    def perform_create(self, serializer):
        event_id = self.kwargs['event_id']
        event = get_object_or_404(Event, id=event_id)

        # Проверяем, есть ли уже отзыв от этого пользователя
        existing_review = EventReview.objects.filter(event=event, author=self.request.user).first()

        if existing_review:
            # Обновляем существующий отзыв
            print(f"🔄 Обновляем существующий отзыв пользователя {self.request.user.username}")
            existing_review.rating = serializer.validated_data['rating']
            existing_review.comment = serializer.validated_data.get('comment', '')
            existing_review.save()
            # Заменяем instance в сериализаторе для корректного ответа
            serializer.instance = existing_review
        else:
            # Создаем новый отзыв
            print(f"✅ Создаем новый отзыв от пользователя {self.request.user.username}")
            serializer.save(event=event, author=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_event(request, event_id):
    """Присоединиться к событию"""
    event = get_object_or_404(Event, id=event_id)
    user = request.user

    # Проверяем, что пользователь еще не участник
    if event.participants.filter(id=user.id).exists():
        return Response(
            {'error': 'Вы уже являетесь участником этого события'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Проверяем лимит участников
    if event.max_participants and event.participants_count >= event.max_participants:
        return Response(
            {'error': 'Достигнуто максимальное количество участников'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Создаем участие
    participation = EventParticipant.objects.create(
        event=event,
        user=user,
        status='registered' if event.requires_registration else 'confirmed'
    )

    serializer = EventParticipantSerializer(participation)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def leave_event(request, event_id):
    """Покинуть событие"""
    event = get_object_or_404(Event, id=event_id)
    user = request.user

    try:
        participation = EventParticipant.objects.get(event=event, user=user)
        participation.delete()
        return Response({'message': 'Вы покинули событие'}, status=status.HTTP_200_OK)
    except EventParticipant.DoesNotExist:
        return Response(
            {'error': 'Вы не являетесь участником этого события'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_event_from_post(request):
    """Создать событие из поста"""
    serializer = EventCreateFromPostSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        event = serializer.save()
        response_serializer = EventDetailSerializer(event, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def calendar_events(request):
    """События для календаря по месяцам"""
    year = request.query_params.get('year', timezone.now().year)
    month = request.query_params.get('month', timezone.now().month)

    try:
        year = int(year)
        month = int(month)
    except (ValueError, TypeError):
        return Response(
            {'error': 'Неверный формат года или месяца'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Получаем события за месяц
    events = Event.objects.filter(
        start_datetime__year=year,
        start_datetime__month=month,
        is_public=True
    ).order_by('start_datetime')

    # Группируем по дням
    calendar_data = {}
    for event in events:
        day = event.start_datetime.day
        if day not in calendar_data:
            calendar_data[day] = []

        calendar_data[day].append({
            'id': str(event.id),
            'title': event.title,
            'time': event.start_datetime.strftime('%H:%M'),
            'category': event.category,
            'location': event.location
        })

    return Response({
        'year': year,
        'month': month,
        'events': calendar_data
    })


class IsEventOrganizerOrReadOnly(permissions.BasePermission):
    """Разрешение только для организатора события"""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.organizer == request.user
