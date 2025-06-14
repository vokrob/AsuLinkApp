from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, EventParticipant, EventReview
from accounts.models import UserProfile


class EventOrganizerSerializer(serializers.ModelSerializer):
    """Сериализатор для организатора события"""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    avatar_url = serializers.CharField(source='profile.avatar_url', read_only=True)
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'avatar_url', 'role']


class EventParticipantSerializer(serializers.ModelSerializer):
    """Сериализатор для участника события"""
    user = EventOrganizerSerializer(read_only=True)

    class Meta:
        model = EventParticipant
        fields = ['user', 'status', 'registered_at', 'notes']


class EventReviewSerializer(serializers.ModelSerializer):
    """Сериализатор для отзывов на события"""
    author = EventOrganizerSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = EventReview
        fields = ['id', 'author', 'author_id', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Автоматически устанавливаем автора из контекста запроса
        validated_data['author'] = self.context['request'].user
        validated_data.pop('author_id', None)
        return super().create(validated_data)


class EventListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка событий"""
    organizer = EventOrganizerSerializer(read_only=True)
    participants_count = serializers.ReadOnlyField()
    average_rating = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    is_today = serializers.ReadOnlyField()
    user_is_participant = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'start_datetime', 'end_datetime',
            'location', 'organizer', 'participants_count', 'average_rating',
            'is_public', 'requires_registration', 'max_participants',
            'is_past', 'is_today', 'user_is_participant', 'created_at'
        ]

    def get_user_is_participant(self, obj):
        """Проверяет, является ли текущий пользователь участником события"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participants.filter(id=request.user.id).exists()
        return False


class EventDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор для события"""
    organizer = EventOrganizerSerializer(read_only=True)
    organizer_id = serializers.IntegerField(write_only=True, required=False)
    participants = EventParticipantSerializer(source='event_participants', many=True, read_only=True)
    reviews = EventReviewSerializer(many=True, read_only=True)
    participants_count = serializers.ReadOnlyField()
    average_rating = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    is_today = serializers.ReadOnlyField()
    user_is_participant = serializers.SerializerMethodField()
    user_participation_status = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'start_datetime', 'end_datetime',
            'location', 'organizer', 'organizer_id', 'participants', 'reviews',
            'participants_count', 'average_rating', 'is_public', 'requires_registration',
            'max_participants', 'related_post', 'is_past', 'is_today',
            'user_is_participant', 'user_participation_status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_user_is_participant(self, obj):
        """Проверяет, является ли текущий пользователь участником события"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.participants.filter(id=request.user.id).exists()
        return False

    def get_user_participation_status(self, obj):
        """Возвращает статус участия текущего пользователя"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            participation = obj.event_participants.filter(user=request.user).first()
            return participation.status if participation else None
        return None

    def create(self, validated_data):
        # Автоматически устанавливаем организатора из контекста запроса
        validated_data['organizer'] = self.context['request'].user
        validated_data.pop('organizer_id', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Убираем organizer_id из validated_data при обновлении
        validated_data.pop('organizer_id', None)
        return super().update(instance, validated_data)


class EventCreateFromPostSerializer(serializers.Serializer):
    """Сериализатор для создания события из поста"""
    post_id = serializers.UUIDField()
    title = serializers.CharField(max_length=200)
    start_datetime = serializers.DateTimeField()
    end_datetime = serializers.DateTimeField(required=False)
    location = serializers.CharField(max_length=200, required=False)
    category = serializers.ChoiceField(choices=Event.EVENT_CATEGORIES, default='university')
    description = serializers.CharField(required=False)
    is_public = serializers.BooleanField(default=True)
    requires_registration = serializers.BooleanField(default=False)
    max_participants = serializers.IntegerField(required=False)

    def validate_post_id(self, value):
        """Проверяем, что пост существует"""
        from posts.models import Post
        try:
            Post.objects.get(id=value)
        except Post.DoesNotExist:
            raise serializers.ValidationError("Пост не найден")
        return value

    def create(self, validated_data):
        """Создаем событие на основе поста"""
        from posts.models import Post
        
        post_id = validated_data.pop('post_id')
        post = Post.objects.get(id=post_id)
        
        event = Event.objects.create(
            organizer=self.context['request'].user,
            related_post=post,
            **validated_data
        )
        return event
