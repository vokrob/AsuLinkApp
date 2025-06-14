from django.core.management.base import BaseCommand
from events.models import Event
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Create test events data'

    def handle(self, **options):
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
                'title': 'День открытых дверей АлтГУ 2024',
                'description': 'Приглашаем абитуриентов и их родителей познакомиться с Алтайским государственным университетом. В программе: презентации всех институтов и факультетов, экскурсии по учебным корпусам и лабораториям, встречи с деканами и преподавателями, консультации по поступлению.',
                'category': 'university',
                'location': 'Главный корпус АлтГУ, пр. Ленина, 61',
                'start_datetime': timezone.now() + timedelta(days=7),
                'end_datetime': timezone.now() + timedelta(days=7, hours=6),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 500,
            },
            {
                'title': 'XXVI Международная конференция "Молодая наука Алтая"',
                'description': 'Ежегодная научная конференция студентов, аспирантов и молодых ученых. Секции: математика и информатика, физика и техника, химия и биология, гуманитарные науки, экономика и управление. Лучшие работы будут рекомендованы к публикации в научных журналах.',
                'category': 'conference',
                'location': 'Корпус "Л", ул. Димитрова, 66',
                'start_datetime': timezone.now() + timedelta(days=14),
                'end_datetime': timezone.now() + timedelta(days=16),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 300,
            },
            {
                'title': 'Мастер-класс "Основы веб-разработки"',
                'description': 'Практический мастер-класс от IT-компании "Сибирикс" для студентов технических специальностей. Изучаем HTML, CSS, JavaScript и создаем первый сайт. Участникам предоставляются ноутбуки. По итогам - сертификаты и возможность стажировки.',
                'category': 'workshop',
                'location': 'Корпус "Л", компьютерный класс 105',
                'start_datetime': timezone.now() + timedelta(days=3),
                'end_datetime': timezone.now() + timedelta(days=3, hours=4),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 30,
            },
            {
                'title': 'Спартакиада АлтГУ среди первокурсников',
                'description': 'Традиционные спортивные соревнования для студентов первого курса всех институтов и факультетов. Виды спорта: волейбол, баскетбол, мини-футбол, настольный теннис, легкая атлетика, плавание. Команды-победители получат кубки и дипломы.',
                'category': 'sports',
                'location': 'Спортивный комплекс АлтГУ, ул. Красноармейский пр., 90',
                'start_datetime': timezone.now() + timedelta(days=10),
                'end_datetime': timezone.now() + timedelta(days=12),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 500,
            },
            {
                'title': 'Фестиваль "Студенческая весна АлтГУ"',
                'description': 'Ежегодный фестиваль творчества студентов АлтГУ. Конкурсы: вокал, хореография, театральное искусство, КВН, литературное творчество. Гала-концерт с участием лучших номеров. Призы и дипломы победителям.',
                'category': 'cultural',
                'location': 'Актовый зал главного корпуса, пр. Ленина, 61',
                'start_datetime': timezone.now() + timedelta(days=5),
                'end_datetime': timezone.now() + timedelta(days=5, hours=3),
                'is_public': True,
                'requires_registration': False,
                'max_participants': None,
            },
            {
                'title': 'Защита выпускных квалификационных работ - ИМИТ',
                'description': 'Государственная итоговая аттестация выпускников Института математики и информационных технологий. Защита бакалаврских и магистерских диссертаций по направлениям: прикладная математика, информатика, программная инженерия.',
                'category': 'exam',
                'location': 'Корпус "Л", аудитории 301-305, 401-405',
                'start_datetime': timezone.now() + timedelta(days=21),
                'end_datetime': timezone.now() + timedelta(days=31),
                'is_public': True,
                'requires_registration': False,
                'max_participants': None,
            },
            {
                'title': 'IT-хакатон "Цифровые решения для Алтайского края"',
                'description': 'Региональный хакатон для студентов и молодых IT-специалистов. Задача: создать цифровые решения для развития туризма, сельского хозяйства и экологии региона. Партнеры: Правительство Алтайского края, IT-компании. Призовой фонд: 1 млн рублей.',
                'category': 'workshop',
                'location': 'Корпус "Л", компьютерные классы 101-110',
                'start_datetime': timezone.now() + timedelta(days=30),
                'end_datetime': timezone.now() + timedelta(days=32),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 150,
            },
            {
                'title': 'Лекция "Квантовые технологии: настоящее и будущее"',
                'description': 'Открытая лекция доктора физико-математических наук, профессора МГУ о современном состоянии квантовых технологий, квантовых компьютерах и их применении. Лекция будет интересна студентам физико-технических специальностей.',
                'category': 'academic',
                'location': 'Корпус "Д", большая физическая аудитория 201',
                'start_datetime': timezone.now() + timedelta(days=18),
                'end_datetime': timezone.now() + timedelta(days=18, hours=2),
                'is_public': True,
                'requires_registration': False,
                'max_participants': None,
            },
            {
                'title': 'Посвящение в студенты АлтГУ',
                'description': 'Торжественная церемония посвящения первокурсников в студенты Алтайского государственного университета. В программе: торжественная часть с участием ректора, концертная программа, вручение студенческих билетов, фотосессия.',
                'category': 'university',
                'location': 'Актовый зал главного корпуса, пр. Ленина, 61',
                'start_datetime': timezone.now() + timedelta(days=25),
                'end_datetime': timezone.now() + timedelta(days=25, hours=3),
                'is_public': True,
                'requires_registration': False,
                'max_participants': None,
            },
            {
                'title': 'Ярмарка вакансий "Карьера в АлтГУ"',
                'description': 'Встреча студентов и выпускников с работодателями Алтайского края и других регионов. Участвуют более 50 компаний различных сфер деятельности. Презентации компаний, собеседования, мастер-классы по составлению резюме.',
                'category': 'university',
                'location': 'Спортивный комплекс АлтГУ, ул. Красноармейский пр., 90',
                'start_datetime': timezone.now() + timedelta(days=35),
                'end_datetime': timezone.now() + timedelta(days=35, hours=6),
                'is_public': True,
                'requires_registration': False,
                'max_participants': None,
            },
            {
                'title': 'Турнир по киберспорту АлтГУ',
                'description': 'Университетский турнир по киберспорту среди студентов. Дисциплины: CS:GO, Dota 2, League of Legends. Командные и индивидуальные соревнования. Призовой фонд, дипломы победителям, трансляция финалов.',
                'category': 'sports',
                'location': 'Корпус "Л", компьютерные классы 201-205',
                'start_datetime': timezone.now() + timedelta(days=40),
                'end_datetime': timezone.now() + timedelta(days=42),
                'is_public': True,
                'requires_registration': True,
                'max_participants': 120,
            },
            {
                'title': 'Выставка "Научные достижения АлтГУ"',
                'description': 'Выставка научных разработок и инновационных проектов преподавателей и студентов университета. Представлены работы по биотехнологиям, информационным технологиям, материаловедению, экологии. Демонстрация действующих прототипов.',
                'category': 'academic',
                'location': 'Музей АлтГУ, главный корпус, 1 этаж',
                'start_datetime': timezone.now() + timedelta(days=45),
                'end_datetime': timezone.now() + timedelta(days=49),
                'is_public': True,
                'requires_registration': False,
                'max_participants': None,
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
