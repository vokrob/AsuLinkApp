from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from posts.models import Post
import uuid


class Event(models.Model):
    """Model for university and personal events"""
    EVENT_CATEGORIES = [
        ('university', 'University'),
        ('personal', 'Personal'),
        ('academic', 'Academic'),
        ('cultural', 'Cultural'),
        ('sports', 'Sports'),
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('meeting', 'Meeting'),
        ('exam', 'Exam'),
        ('deadline', 'Deadline'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, verbose_name="Title")
    description = models.TextField(blank=True, verbose_name="Description")
    category = models.CharField(max_length=20, choices=EVENT_CATEGORIES, default='university', verbose_name="Category")

    # Time and location
    start_datetime = models.DateTimeField(verbose_name="Start date and time")
    end_datetime = models.DateTimeField(null=True, blank=True, verbose_name="End date and time")
    location = models.CharField(max_length=200, blank=True, verbose_name="Location")

    # Relations
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events', verbose_name="Organizer")
    participants = models.ManyToManyField(User, through='EventParticipant', related_name='events', blank=True)
    related_post = models.ForeignKey(Post, on_delete=models.SET_NULL, null=True, blank=True, related_name='events', verbose_name="Related post")

    # Additional fields
    max_participants = models.PositiveIntegerField(null=True, blank=True, verbose_name="Maximum participants")
    is_public = models.BooleanField(default=True, verbose_name="Public event")
    requires_registration = models.BooleanField(default=False, verbose_name="Requires registration")

    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_datetime']
        verbose_name = "Event"
        verbose_name_plural = "Events"

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
