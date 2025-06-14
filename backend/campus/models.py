from django.db import models
from django.contrib.auth.models import User
import uuid


class Building(models.Model):
    """Модель для корпусов университета"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Название корпуса")
    address = models.CharField(max_length=200, verbose_name="Адрес")
    description = models.TextField(blank=True, verbose_name="Описание")
    image = models.ImageField(upload_to='buildings/', blank=True, null=True, verbose_name="Изображение")
    floors = models.PositiveIntegerField(default=1, verbose_name="Количество этажей")

    # Координаты для карты
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Широта")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Долгота")

    # Системные поля
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Корпус"
        verbose_name_plural = "Корпуса"

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        """Средний рейтинг всех аудиторий в корпусе"""
        rooms = self.rooms.all()
        if rooms:
            total_rating = sum(room.average_rating for room in rooms if room.average_rating > 0)
            rated_rooms = sum(1 for room in rooms if room.average_rating > 0)
            return total_rating / rated_rooms if rated_rooms > 0 else 0
        return 0

    @property
    def total_rooms(self):
        return self.rooms.count()


class Room(models.Model):
    """Модель для аудиторий"""
    ROOM_TYPES = [
        ('classroom', 'Аудитория'),
        ('laboratory', 'Лаборатория'),
        ('lecture', 'Лекционная'),
        ('admin', 'Административная'),
        ('library', 'Библиотека'),
        ('computer', 'Компьютерный класс'),
        ('conference', 'Конференц-зал'),
        ('workshop', 'Мастерская'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='rooms', verbose_name="Корпус")
    number = models.CharField(max_length=20, verbose_name="Номер аудитории")
    floor = models.PositiveIntegerField(verbose_name="Этаж")
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES, default='classroom', verbose_name="Тип аудитории")
    capacity = models.PositiveIntegerField(default=0, verbose_name="Вместимость")
    description = models.TextField(blank=True, verbose_name="Описание")

    # Оборудование
    equipment = models.JSONField(default=list, blank=True, verbose_name="Оборудование")

    # Доступность
    is_accessible = models.BooleanField(default=True, verbose_name="Доступна для использования")

    # Системные поля
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['building', 'floor', 'number']
        unique_together = ('building', 'number')
        verbose_name = "Аудитория"
        verbose_name_plural = "Аудитории"

    def __str__(self):
        return f"{self.building.name} - {self.number}"

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum(review.rating for review in reviews) / len(reviews)
        return 0

    @property
    def reviews_count(self):
        return self.reviews.count()


class RoomReview(models.Model):
    """Модель для отзывов об аудиториях"""
    RATING_CHOICES = [
        (1, '1 - Очень плохо'),
        (2, '2 - Плохо'),
        (3, '3 - Удовлетворительно'),
        (4, '4 - Хорошо'),
        (5, '5 - Отлично'),
    ]

    REVIEW_CATEGORIES = [
        ('cleanliness', 'Чистота'),
        ('equipment', 'Оборудование'),
        ('comfort', 'Комфорт'),
        ('accessibility', 'Доступность'),
        ('lighting', 'Освещение'),
        ('acoustics', 'Акустика'),
        ('temperature', 'Температура'),
        ('general', 'Общее впечатление'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='room_reviews')
    rating = models.IntegerField(choices=RATING_CHOICES, verbose_name="Общая оценка")
    category = models.CharField(max_length=20, choices=REVIEW_CATEGORIES, default='general', verbose_name="Категория отзыва")
    comment = models.TextField(blank=True, verbose_name="Комментарий")

    # Детальные оценки
    cleanliness_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, verbose_name="Чистота")
    equipment_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, verbose_name="Оборудование")
    comfort_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, verbose_name="Комфорт")

    # Системные поля
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('room', 'author')
        ordering = ['-created_at']
        verbose_name = "Отзыв об аудитории"
        verbose_name_plural = "Отзывы об аудиториях"

    def __str__(self):
        return f"Отзыв {self.author.username} на {self.room} - {self.rating}/5"
