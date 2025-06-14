from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Building, Room, RoomReview
from .serializers import (
    BuildingListSerializer, BuildingDetailSerializer,
    RoomListSerializer, RoomDetailSerializer,
    RoomReviewSerializer, RoomReviewCreateSerializer, RoomReviewUpdateSerializer
)


class BuildingListView(generics.ListAPIView):
    """Список корпусов"""
    queryset = Building.objects.all()
    serializer_class = BuildingListSerializer
    permission_classes = [permissions.IsAuthenticated]


class BuildingDetailView(generics.RetrieveAPIView):
    """Детальная информация о корпусе"""
    queryset = Building.objects.all()
    serializer_class = BuildingDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoomListView(generics.ListAPIView):
    """Список аудиторий"""
    serializer_class = RoomListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Room.objects.all()

        # Фильтрация по корпусу
        building_id = self.request.query_params.get('building')
        if building_id:
            queryset = queryset.filter(building_id=building_id)

        # Фильтрация по этажу
        floor = self.request.query_params.get('floor')
        if floor:
            queryset = queryset.filter(floor=floor)

        # Фильтрация по типу аудитории
        room_type = self.request.query_params.get('type')
        if room_type:
            queryset = queryset.filter(room_type=room_type)

        # Поиск по номеру аудитории
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(number__icontains=search)

        return queryset.order_by('building__name', 'floor', 'number')


class RoomDetailView(generics.RetrieveAPIView):
    """Детальная информация об аудитории"""
    queryset = Room.objects.all()
    serializer_class = RoomDetailSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoomReviewListCreateView(generics.ListCreateAPIView):
    """Отзывы об аудитории"""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RoomReviewCreateSerializer
        return RoomReviewSerializer

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return RoomReview.objects.filter(room_id=room_id)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        room_id = self.kwargs['room_id']
        context['room'] = get_object_or_404(Room, id=room_id)
        return context


class RoomReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Детальная информация об отзыве"""
    queryset = RoomReview.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return RoomReviewUpdateSerializer
        return RoomReviewSerializer

    def get_permissions(self):
        """Только автор может изменять/удалять отзыв"""
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsReviewAuthorOrReadOnly()]
        return [permissions.IsAuthenticated()]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def room_statistics(request, room_id):
    """Статистика по аудитории"""
    room = get_object_or_404(Room, id=room_id)
    reviews = room.reviews.all()

    if not reviews:
        return Response({
            'room_id': str(room.id),
            'total_reviews': 0,
            'average_rating': 0,
            'rating_distribution': {},
            'category_ratings': {}
        })

    # Распределение оценок
    rating_distribution = {}
    for i in range(1, 6):
        rating_distribution[i] = reviews.filter(rating=i).count()

    # Средние оценки по категориям
    category_ratings = {}
    for review in reviews:
        if review.cleanliness_rating:
            category_ratings.setdefault('cleanliness', []).append(review.cleanliness_rating)
        if review.equipment_rating:
            category_ratings.setdefault('equipment', []).append(review.equipment_rating)
        if review.comfort_rating:
            category_ratings.setdefault('comfort', []).append(review.comfort_rating)

    # Вычисляем средние значения
    for category, ratings in category_ratings.items():
        category_ratings[category] = sum(ratings) / len(ratings) if ratings else 0

    return Response({
        'room_id': str(room.id),
        'total_reviews': reviews.count(),
        'average_rating': room.average_rating,
        'rating_distribution': rating_distribution,
        'category_ratings': category_ratings
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def building_statistics(request, building_id):
    """Статистика по корпусу"""
    building = get_object_or_404(Building, id=building_id)
    rooms = building.rooms.all()

    total_reviews = sum(room.reviews_count for room in rooms)
    average_rating = building.average_rating

    # Статистика по типам аудиторий
    room_types = {}
    for room in rooms:
        room_type = room.get_room_type_display()
        if room_type not in room_types:
            room_types[room_type] = {
                'count': 0,
                'average_rating': 0,
                'total_capacity': 0
            }
        room_types[room_type]['count'] += 1
        room_types[room_type]['total_capacity'] += room.capacity
        if room.average_rating > 0:
            room_types[room_type]['average_rating'] = (
                room_types[room_type]['average_rating'] + room.average_rating
            ) / 2 if room_types[room_type]['average_rating'] > 0 else room.average_rating

    return Response({
        'building_id': str(building.id),
        'total_rooms': building.total_rooms,
        'total_reviews': total_reviews,
        'average_rating': average_rating,
        'room_types': room_types
    })


class IsReviewAuthorOrReadOnly(permissions.BasePermission):
    """Разрешение только для автора отзыва"""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user
