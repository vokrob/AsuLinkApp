from django.db import models
from django.contrib.auth.models import User
import uuid


class Building(models.Model):
    """Model for university buildings"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Building name")
    address = models.CharField(max_length=200, verbose_name="Address")
    description = models.TextField(blank=True, verbose_name="Description")
    image = models.ImageField(upload_to='buildings/', blank=True, null=True, verbose_name="Image")
    floors = models.PositiveIntegerField(default=1, verbose_name="Number of floors")

    # Map coordinates
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Latitude")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Longitude")

    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Building"
        verbose_name_plural = "Buildings"

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        """Average rating of all rooms in the building"""
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
    """Model for classrooms"""
    ROOM_TYPES = [
        ('classroom', 'Classroom'),
        ('laboratory', 'Laboratory'),
        ('lecture', 'Lecture Hall'),
        ('admin', 'Administrative'),
        ('library', 'Library'),
        ('computer', 'Computer Lab'),
        ('conference', 'Conference Room'),
        ('workshop', 'Workshop'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    building = models.ForeignKey(Building, on_delete=models.CASCADE, related_name='rooms', verbose_name="Building")
    number = models.CharField(max_length=20, verbose_name="Room number")
    floor = models.PositiveIntegerField(verbose_name="Floor")
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES, default='classroom', verbose_name="Room type")
    capacity = models.PositiveIntegerField(default=0, verbose_name="Capacity")
    description = models.TextField(blank=True, verbose_name="Description")

    # Equipment
    equipment = models.JSONField(default=list, blank=True, verbose_name="Equipment")

    # Accessibility
    is_accessible = models.BooleanField(default=True, verbose_name="Available for use")

    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['building', 'floor', 'number']
        unique_together = ('building', 'number')
        verbose_name = "Room"
        verbose_name_plural = "Rooms"

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
    """Model for room reviews"""
    RATING_CHOICES = [
        (1, '1 - Very Poor'),
        (2, '2 - Poor'),
        (3, '3 - Satisfactory'),
        (4, '4 - Good'),
        (5, '5 - Excellent'),
    ]

    REVIEW_CATEGORIES = [
        ('cleanliness', 'Cleanliness'),
        ('equipment', 'Equipment'),
        ('comfort', 'Comfort'),
        ('accessibility', 'Accessibility'),
        ('lighting', 'Lighting'),
        ('acoustics', 'Acoustics'),
        ('temperature', 'Temperature'),
        ('general', 'General Impression'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='room_reviews')
    rating = models.IntegerField(choices=RATING_CHOICES, verbose_name="Overall rating")
    category = models.CharField(max_length=20, choices=REVIEW_CATEGORIES, default='general', verbose_name="Review category")
    comment = models.TextField(blank=True, verbose_name="Comment")

    # Detailed ratings
    cleanliness_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, verbose_name="Cleanliness")
    equipment_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, verbose_name="Equipment")
    comfort_rating = models.IntegerField(choices=RATING_CHOICES, null=True, blank=True, verbose_name="Comfort")

    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('room', 'author')
        ordering = ['-created_at']
        verbose_name = "Room Review"
        verbose_name_plural = "Room Reviews"

    def __str__(self):
        return f"Review by {self.author.username} for {self.room} - {self.rating}/5"
