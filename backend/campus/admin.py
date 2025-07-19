from django.contrib import admin
from .models import Building, Room, RoomReview


@admin.register(Building)
class BuildingAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'floors', 'total_rooms', 'average_rating']
    search_fields = ['name', 'address', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at', 'total_rooms', 'average_rating']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'address', 'description', 'image', 'floors')
        }),
        ('Coordinates', {
            'fields': ('latitude', 'longitude'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('total_rooms', 'average_rating'),
            'classes': ('collapse',)
        }),
        ('System Information', {
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
        ('Basic Information', {
            'fields': ('building', 'number', 'floor', 'room_type', 'capacity')
        }),
        ('Description and Equipment', {
            'fields': ('description', 'equipment', 'is_accessible')
        }),
        ('Statistics', {
            'fields': ('average_rating', 'reviews_count'),
            'classes': ('collapse',)
        }),
        ('System Information', {
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
        ('Basic Information', {
            'fields': ('room', 'author', 'rating', 'category', 'comment')
        }),
        ('Detailed Ratings', {
            'fields': ('cleanliness_rating', 'equipment_rating', 'comfort_rating'),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
