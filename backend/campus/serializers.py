from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Building, Room, RoomReview


class BuildingListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка корпусов"""
    average_rating = serializers.ReadOnlyField()
    total_rooms = serializers.ReadOnlyField()

    class Meta:
        model = Building
        fields = [
            'id', 'name', 'address', 'description', 'image', 'floors',
            'average_rating', 'total_rooms', 'latitude', 'longitude'
        ]


class RoomReviewAuthorSerializer(serializers.ModelSerializer):
    """Сериализатор для автора отзыва"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    avatar_url = serializers.CharField(source='profile.avatar_url', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'avatar_url']


class RoomReviewSerializer(serializers.ModelSerializer):
    """Сериализатор для отзывов об аудиториях"""
    author = RoomReviewAuthorSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = RoomReview
        fields = [
            'id', 'author', 'author_id', 'rating', 'category', 'comment',
            'cleanliness_rating', 'equipment_rating', 'comfort_rating',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Автоматически устанавливаем автора из контекста запроса
        validated_data['author'] = self.context['request'].user
        validated_data.pop('author_id', None)
        return super().create(validated_data)


class RoomListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка аудиторий"""
    building_name = serializers.CharField(source='building.name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    reviews_count = serializers.ReadOnlyField()
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)

    class Meta:
        model = Room
        fields = [
            'id', 'number', 'building', 'building_name', 'floor', 'room_type',
            'room_type_display', 'capacity', 'description', 'equipment',
            'is_accessible', 'average_rating', 'reviews_count'
        ]


class RoomDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор для аудитории"""
    building = BuildingListSerializer(read_only=True)
    reviews = RoomReviewSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    reviews_count = serializers.ReadOnlyField()
    room_type_display = serializers.CharField(source='get_room_type_display', read_only=True)
    user_review = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'id', 'number', 'building', 'floor', 'room_type', 'room_type_display',
            'capacity', 'description', 'equipment', 'is_accessible',
            'average_rating', 'reviews_count', 'reviews', 'user_review',
            'created_at', 'updated_at'
        ]

    def get_user_review(self, obj):
        """Возвращает отзыв текущего пользователя, если он есть"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            review = obj.reviews.filter(author=request.user).first()
            if review:
                return RoomReviewSerializer(review, context=self.context).data
        return None


class BuildingDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор для корпуса"""
    rooms = RoomListSerializer(many=True, read_only=True)
    average_rating = serializers.ReadOnlyField()
    total_rooms = serializers.ReadOnlyField()

    class Meta:
        model = Building
        fields = [
            'id', 'name', 'address', 'description', 'image', 'floors',
            'latitude', 'longitude', 'average_rating', 'total_rooms',
            'rooms', 'created_at', 'updated_at'
        ]


class RoomReviewCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания отзыва об аудитории"""
    
    class Meta:
        model = RoomReview
        fields = [
            'rating', 'category', 'comment',
            'cleanliness_rating', 'equipment_rating', 'comfort_rating'
        ]

    def create(self, validated_data):
        # Автоматически устанавливаем автора и аудиторию из контекста
        validated_data['author'] = self.context['request'].user
        validated_data['room'] = self.context['room']
        return super().create(validated_data)

    def validate(self, data):
        """Проверяем, что пользователь еще не оставлял отзыв на эту аудиторию"""
        room = self.context['room']
        user = self.context['request'].user
        
        if RoomReview.objects.filter(room=room, author=user).exists():
            raise serializers.ValidationError("Вы уже оставили отзыв на эту аудиторию")
        
        return data


class RoomReviewUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления отзыва об аудитории"""
    
    class Meta:
        model = RoomReview
        fields = [
            'rating', 'category', 'comment',
            'cleanliness_rating', 'equipment_rating', 'comfort_rating'
        ]
