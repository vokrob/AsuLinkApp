from django.contrib import admin
from .models import Building, Room, RoomReview


@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'floors', 'total_rooms', 'average_rating']
    search_fields = ['name', 'address', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at', 'total_rooms', 'average_rating']

    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'address', 'description', 'image', 'floors')
        }),
        ('Координаты', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('Статистика', {
            'fields': ('total_rooms', 'average_rating'),
            'classes': ('collapse',)
        }),
        ('Системная информация', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['number', 'building', 'floor', 'room_type', 'capacity', 'average_rating', 'reviews_count', 'is_accessible']
    list_filter = ['building', 'floor', 'room_type', 'is_accessible']
    search_fields = ['number', 'building__name', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at', 'average_rating', 'reviews_count']

    fieldsets = (
        ('Основная информация', {
            'fields': ('building', 'number', 'floor', 'room_type', 'capacity')
        }),
        ('Описание и оборудование', {
            'fields': ('description', 'equipment', 'is_accessible')
        }),
        ('Статистика', {
            'fields': ('average_rating', 'reviews_count'),
            'classes': ('collapse',)
        }),
        ('Системная информация', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(RoomReview)
class RoomReviewAdmin(admin.ModelAdmin):
    list_display = ['room', 'author', 'rating', 'category', 'created_at']
    list_filter = ['rating', 'category', 'created_at']
    search_fields = ['room__number', 'room__building__name', 'author__username', 'comment']
    readonly_fields = ['id', 'created_at', 'updated_at']

    fieldsets = (
        ('Основная информация', {
            'fields': ('room', 'author', 'rating', 'category', 'comment')
        }),
        ('Детальные оценки', {
            'fields': ('cleanliness_rating', 'equipment_rating', 'comfort_rating'),
            'classes': ('collapse',)
        }),
        ('Системная информация', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
