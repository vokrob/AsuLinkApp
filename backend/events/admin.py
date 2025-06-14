from django.contrib import admin
from .models import Event, EventParticipant, EventReview


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'start_datetime', 'location', 'organizer', 'participants_count', 'is_public']
    list_filter = ['category', 'is_public', 'requires_registration', 'start_datetime']
    search_fields = ['title', 'description', 'location', 'organizer__username']
    readonly_fields = ['id', 'created_at', 'updated_at', 'participants_count']

    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'description', 'category', 'organizer')
        }),
        ('Время и место', {
            'fields': ('start_datetime', 'end_datetime', 'location')
        }),
        ('Настройки', {
            'fields': ('is_public', 'requires_registration', 'max_participants')
        }),
        ('Связи', {
            'fields': ('related_post',)
        }),
        ('Системная информация', {
            'fields': ('id', 'created_at', 'updated_at', 'participants_count'),
            'classes': ('collapse',)
        }),
    )


@admin.register(EventParticipant)
class EventParticipantAdmin(admin.ModelAdmin):
    list_display = ['event', 'user', 'status', 'registered_at']
    list_filter = ['status', 'registered_at']
    search_fields = ['event__title', 'user__username', 'user__email']
    readonly_fields = ['registered_at']


@admin.register(EventReview)
class EventReviewAdmin(admin.ModelAdmin):
    list_display = ['event', 'author', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['event__title', 'author__username', 'comment']
    readonly_fields = ['id', 'created_at', 'updated_at']
