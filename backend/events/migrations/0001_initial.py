# Generated by Django 5.1.4 on 2025-06-13 13:07

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('posts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200, verbose_name='Название')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
                ('category', models.CharField(choices=[('university', 'Университетское'), ('personal', 'Личное'), ('academic', 'Учебное'), ('cultural', 'Культурное'), ('sports', 'Спортивное'), ('conference', 'Конференция'), ('workshop', 'Мастер-класс'), ('meeting', 'Встреча'), ('exam', 'Экзамен'), ('deadline', 'Дедлайн')], default='university', max_length=20, verbose_name='Категория')),
                ('start_datetime', models.DateTimeField(verbose_name='Дата и время начала')),
                ('end_datetime', models.DateTimeField(blank=True, null=True, verbose_name='Дата и время окончания')),
                ('location', models.CharField(blank=True, max_length=200, verbose_name='Место проведения')),
                ('max_participants', models.PositiveIntegerField(blank=True, null=True, verbose_name='Максимум участников')),
                ('is_public', models.BooleanField(default=True, verbose_name='Публичное событие')),
                ('requires_registration', models.BooleanField(default=False, verbose_name='Требует регистрации')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('organizer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='organized_events', to=settings.AUTH_USER_MODEL, verbose_name='Организатор')),
                ('related_post', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='events', to='posts.post', verbose_name='Связанный пост')),
            ],
            options={
                'verbose_name': 'Событие',
                'verbose_name_plural': 'События',
                'ordering': ['start_datetime'],
            },
        ),
        migrations.CreateModel(
            name='EventParticipant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('registered', 'Зарегистрирован'), ('confirmed', 'Подтвержден'), ('attended', 'Присутствовал'), ('cancelled', 'Отменен')], default='registered', max_length=20)),
                ('registered_at', models.DateTimeField(auto_now_add=True)),
                ('notes', models.TextField(blank=True, verbose_name='Заметки')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='event_participants', to='events.event')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='event_participations', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Участник события',
                'verbose_name_plural': 'Участники событий',
                'unique_together': {('event', 'user')},
            },
        ),
        migrations.AddField(
            model_name='event',
            name='participants',
            field=models.ManyToManyField(blank=True, related_name='events', through='events.EventParticipant', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='EventReview',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('rating', models.IntegerField(choices=[(1, '1 - Очень плохо'), (2, '2 - Плохо'), (3, '3 - Удовлетворительно'), (4, '4 - Хорошо'), (5, '5 - Отлично')], verbose_name='Оценка')),
                ('comment', models.TextField(blank=True, verbose_name='Комментарий')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='event_reviews', to=settings.AUTH_USER_MODEL)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='events.event')),
            ],
            options={
                'verbose_name': 'Отзыв на событие',
                'verbose_name_plural': 'Отзывы на события',
                'ordering': ['-created_at'],
                'unique_together': {('event', 'author')},
            },
        ),
    ]
