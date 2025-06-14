from django.core.management.base import BaseCommand
from events.models import Event
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
import random


class Command(BaseCommand):
    help = 'Create test events data'

    def handle(self, *args, **options):
        self.stdout.write('Creating test events data...')

        # Получаем или создаем пользователя-организатора
        organizer, created = User.objects.get_or_create(
            username='event_organizer',
            defaults={
                'email': 'organizer@asu.ru',
                'first_name': 'Организатор',
                'last_name': 'Событий',
            }
        )
        if created:
            organizer.set_password('password123')
            organizer.save()
            self.stdout.write(f'Created organizer user: {organizer.username}')

        # Создаем события
        events_data = [
            {
                'title': 'День открытых дверей',
                'description': 'Ежегодное мероприятие для абитуриентов и их родителей. Презентации факультетов, встречи с преподавателями, экскурсии по корпусам.',
                'category': 'university',
                'location': 'Корпус Л, Актовый зал',
                'start_datetime': timezone.now() + timedelta(days=7),
                'end_datetime': timezone.now() + timedelta(days=7, hours=4),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 200,
            },
            {
                'title': 'Научная конференция "Инновации в IT"',
                'description': 'Конференция для студентов и преподавателей по современным технологиям в области информационных технологий.',
                'category': 'conference',
                'location': 'Корпус К, Конференц-зал',
                'start_datetime': timezone.now() + timedelta(days=14),
                'end_datetime': timezone.now() + timedelta(days=14, hours=6),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 100,
            },
            {
                'title': 'Мастер-класс по программированию',
                'description': 'Практический мастер-класс по разработке мобильных приложений с использованием React Native.',
                'category': 'workshop',
                'location': 'Корпус К, Аудитория 402',
                'start_datetime': timezone.now() + timedelta(days=3),
                'end_datetime': timezone.now() + timedelta(days=3, hours=3),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 25,
            },
            {
                'title': 'Спортивные соревнования',
                'description': 'Межфакультетские соревнования по волейболу и баскетболу.',
                'category': 'sports',
                'location': 'Спортивный комплекс АлтГУ',
                'start_datetime': timezone.now() + timedelta(days=10),
                'end_datetime': timezone.now() + timedelta(days=10, hours=8),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 150,
            },
            {
                'title': 'Культурный вечер',
                'description': 'Вечер поэзии и музыки, посвященный творчеству алтайских поэтов.',
                'category': 'cultural',
                'location': 'Корпус Д, Актовый зал',
                'start_datetime': timezone.now() + timedelta(days=5),
                'end_datetime': timezone.now() + timedelta(days=5, hours=2),
                'is_public': True,
                'requires_registration': False,
                'max_participants': 80,
            },
            {
                'title': 'Экзамен по математике',
                'description': 'Промежуточная аттестация по высшей математике для студентов 1 курса.',
                'category': 'exam',
                'location': 'Корпус Л, Аудитория 214',
                'start_datetime': timezone.now() + timedelta(days=21),
                'end_datetime': timezone.now() + timedelta(days=21, hours=2),
                'is_public': False,
                'requires_registration': False,
            },
            {
                'title': 'Дедлайн курсовой работы',
                'description': 'Последний день сдачи курсовых работ по дисциплине "Базы данных".',
                'category': 'deadline',
                'location': 'Корпус К, Кафедра ИТ',
                'start_datetime': timezone.now() + timedelta(days=30),
                'is_public': False,
                'requires_registration': False,
            },
            {
                'title': 'Встреча с работодателями',
                'description': 'Презентация IT-компаний региона и возможностей трудоустройства для выпускников.',
                'category': 'meeting',
                'location': 'Корпус С, Конференц-зал',
                'start_datetime': timezone.now() + timedelta(days=12),
                'end_datetime': timezone.now() + timedelta(days=12, hours=3),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 60,
            },
            {
                'title': 'Лекция приглашенного профессора',
                'description': 'Открытая лекция профессора МГУ по теме "Искусственный интеллект в образовании".',
                'category': 'academic',
                'location': 'Корпус Л, Большая аудитория',
                'start_datetime': timezone.now() + timedelta(days=18),
                'end_datetime': timezone.now() + timedelta(days=18, hours=2),
                'is_public': True,
                'requires_registration': False,
                'max_participants': 200,
            },
            {
                'title': 'Студенческая научная конференция',
                'description': 'Презентация научных работ студентов всех курсов и факультетов.',
                'category': 'conference',
                'location': 'Корпус М, Актовый зал',
                'start_datetime': timezone.now() + timedelta(days=25),
                'end_datetime': timezone.now() + timedelta(days=25, hours=5),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 120,
            },
        ]

        for event_data in events_data:
            event, created = Event.objects.get_or_create(
                title=event_data['title'],
                organizer=organizer,
                defaults=event_data
            )
            if created:
                self.stdout.write(f'Created event: {event.title}')
            else:
                self.stdout.write(f'Event already exists: {event.title}')

        self.stdout.write(self.style.SUCCESS('Successfully created test events data!'))
