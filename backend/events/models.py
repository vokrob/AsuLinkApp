from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from posts.models import Post
import uuid


class Event(models.Model):
    """Модель для событий университета и личных событий"""
    EVENT_CATEGORIES = [
        ('university', 'Университетское'),
        ('personal', 'Личное'),
        ('academic', 'Учебное'),
        ('cultural', 'Культурное'),
        ('sports', 'Спортивное'),
        ('conference', 'Конференция'),
        ('workshop', 'Мастер-класс'),
        ('meeting', 'Встреча'),
        ('exam', 'Экзамен'),
        ('deadline', 'Дедлайн'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")
    category = models.CharField(max_length=20, choices=EVENT_CATEGORIES, default='university', verbose_name="Категория")

    # Время и место
    start_datetime = models.DateTimeField(verbose_name="Дата и время начала")
    end_datetime = models.DateTimeField(null=True, blank=True, verbose_name="Дата и время окончания")
    location = models.CharField(max_length=200, blank=True, verbose_name="Место проведения")

    # Связи
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events', verbose_name="Организатор")
    participants = models.ManyToManyField(User, through='EventParticipant', related_name='events', blank=True)
    related_post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True, blank=True, related_name='events', verbose_name="Связанный пост")

    # Дополнительные поля
    max_participants = models.PositiveIntegerField(null=True, blank=True, verbose_name="Максимум участников")
    is_public = models.BooleanField(default=True, verbose_name="Публичное событие")
    requires_registration = models.BooleanField(default=False, verbose_name="Требует регистрации")

    # Системные поля
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_datetime']
        verbose_name = "Событие"
        verbose_name_plural = "События"

    def __str__(self):
        return f"{self.title} - {self.start_datetime.strftime('%d.%m.%Y %H:%M')}"

    @property
    def participants_count(self):
        return self.participants.count()

    @property
    def is_past(self):
        return self.start_datetime < timezone.now()

    @property
    def is_today(self):
        today = timezone.now().date()
        return self.start_datetime.date() == today

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews:
            return sum(review.rating for review in reviews) / len(reviews)
        return 0


class EventParticipant(models.Model):
    """Модель для участников событий"""
    PARTICIPATION_STATUS = [
        ('registered', 'Зарегистрирован'),
        ('confirmed', 'Подтвержден'),
        ('attended', 'Присутствовал'),
        ('cancelled', 'Отменен'),
    ]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='event_participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_participations')
    status = models.CharField(max_length=20, choices=PARTICIPATION_STATUS, default='registered')
    registered_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, verbose_name="Заметки")

    class Meta:
        unique_together = ('event', 'user')
        verbose_name = "Участник события"
        verbose_name_plural = "Участники событий"

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"


class EventReview(models.Model):
    """Модель для отзывов на мероприятия"""
    RATING_CHOICES = [
        (1, '1 - Очень плохо'),
        (2, '2 - Плохо'),
        (3, '3 - Удовлетворительно'),
        (4, '4 - Хорошо'),
        (5, '5 - Отлично'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='event_reviews')
    rating = models.IntegerField(choices=RATING_CHOICES, verbose_name="Оценка")
    comment = models.TextField(blank=True, verbose_name="Комментарий")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('event', 'author')
        ordering = ['-created_at']
        verbose_name = "Отзыв на событие"
        verbose_name_plural = "Отзывы на события"

    def __str__(self):
        return f"Отзыв {self.author.username} на {self.event.title} - {self.rating}/5"
