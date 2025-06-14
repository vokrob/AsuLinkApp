from django.core.management.base import BaseCommand
from campus.models import Building, Room
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Create test campus data'

    def handle(self, *args, **options):
        self.stdout.write('Creating test campus data...')

        # Создаем корпуса
        buildings_data = [
            {
                'name': 'Корпус Л',
                'address': 'пр. Ленина, 61',
                'description': 'Учебный корпус, в котором располагаются Институт биологии и биотехнологии, Институт математики и информационных технологий. Оснащен современными лабораториями и компьютерными классами для практических занятий студентов.',
                'floors': 4,
                'latitude': 53.3498,
                'longitude': 83.7798,
            },
            {
                'name': 'Корпус С',
                'address': 'пр-т Социалистический, 68',
                'description': 'Здесь находятся МИЭМИС (Международный институт экономики, менеджмента и информационных систем) и Юридический институт. Корпус оборудован учебными аудиториями и специализированными кабинетами для подготовки экономистов и юристов.',
                'floors': 3,
                'latitude': 53.3456,
                'longitude': 83.7712,
            },
            {
                'name': 'Корпус Д',
                'address': 'ул. Димитрова, 66',
                'description': 'В этом корпусе размещается Институт гуманитарных наук. Здесь проходят занятия студентов филологических, лингвистических и других гуманитарных направлений, расположена библиотека и лингафонные кабинеты.',
                'floors': 5,
                'latitude': 53.3512,
                'longitude': 83.7834,
            },
            {
                'name': 'Корпус М',
                'address': 'пр-т Ленина, 61',
                'description': 'Корпус, в котором располагаются Институт географии и Институт истории и международных отношений. Оснащен картографическими лабораториями, историческими кабинетами и специализированными аудиториями.',
                'floors': 2,
                'latitude': 53.3489,
                'longitude': 83.7801,
            },
            {
                'name': 'Корпус К',
                'address': 'пр-т Красноармейский, 90',
                'description': 'Здесь находятся Институт цифровых технологий, электроники и физики, а также Институт химии и химико-фармацевтических технологий. Корпус оборудован современными лабораториями, исследовательскими центрами и экспериментальными площадками.',
                'floors': 4,
                'latitude': 53.3445,
                'longitude': 83.7689,
            }
        ]

        buildings = []
        for building_data in buildings_data:
            building, created = Building.objects.get_or_create(
                name=building_data['name'],
                defaults=building_data
            )
            buildings.append(building)
            if created:
                self.stdout.write(f'Created building: {building.name}')
            else:
                self.stdout.write(f'Building already exists: {building.name}')

        # Создаем аудитории
        rooms_data = [
            # Корпус Л
            {'building': buildings[0], 'number': '214', 'floor': 2, 'room_type': 'lecture', 'capacity': 150, 'equipment': ['Проектор', 'Микрофон', 'Система видеоконференций']},
            {'building': buildings[0], 'number': '321', 'floor': 3, 'room_type': 'admin', 'capacity': 10, 'equipment': ['Компьютеры', 'Принтер', 'Сканер']},
            {'building': buildings[0], 'number': '105', 'floor': 1, 'room_type': 'computer', 'capacity': 25, 'equipment': ['Компьютеры', 'Интерактивная доска', 'Проектор']},
            
            # Корпус С
            {'building': buildings[1], 'number': '301', 'floor': 3, 'room_type': 'classroom', 'capacity': 30, 'equipment': ['Проектор', 'Компьютеры', 'Интерактивная доска']},
            {'building': buildings[1], 'number': '207', 'floor': 2, 'room_type': 'laboratory', 'capacity': 20, 'equipment': ['Компьютеры', 'Специальное оборудование']},
            {'building': buildings[1], 'number': '101', 'floor': 1, 'room_type': 'lecture', 'capacity': 100, 'equipment': ['Проектор', 'Аудиосистема']},
            
            # Корпус Д
            {'building': buildings[2], 'number': '401', 'floor': 4, 'room_type': 'classroom', 'capacity': 35, 'equipment': ['Юридическая библиотека', 'Компьютер', 'Проектор']},
            {'building': buildings[2], 'number': '203', 'floor': 2, 'room_type': 'lecture', 'capacity': 80, 'equipment': ['Имитация зала суда', 'Аудиосистема', 'Проектор']},
            {'building': buildings[2], 'number': '315', 'floor': 3, 'room_type': 'library', 'capacity': 50, 'equipment': ['Книжные полки', 'Читальные места', 'Компьютеры']},
            
            # Корпус М
            {'building': buildings[3], 'number': '102', 'floor': 1, 'room_type': 'laboratory', 'capacity': 25, 'equipment': ['Лабораторное оборудование', 'Компьютеры', 'Интерактивная доска']},
            {'building': buildings[3], 'number': '210', 'floor': 2, 'room_type': 'classroom', 'capacity': 30, 'equipment': ['Математические модели', 'Проектор']},
            
            # Корпус К
            {'building': buildings[4], 'number': '402', 'floor': 4, 'room_type': 'laboratory', 'capacity': 25, 'equipment': ['Компьютеры', 'VR-оборудование', '3D-принтеры']},
            {'building': buildings[4], 'number': '204', 'floor': 2, 'room_type': 'classroom', 'capacity': 40, 'equipment': ['Проектор', 'Интерактивная доска', 'Аудиосистема']},
            {'building': buildings[4], 'number': '301', 'floor': 3, 'room_type': 'conference', 'capacity': 15, 'equipment': ['Конференц-стол', 'Проектор', 'Система видеосвязи']},
        ]

        for room_data in rooms_data:
            room, created = Room.objects.get_or_create(
                building=room_data['building'],
                number=room_data['number'],
                defaults={
                    'floor': room_data['floor'],
                    'room_type': room_data['room_type'],
                    'capacity': room_data['capacity'],
                    'equipment': room_data['equipment'],
                    'description': f"Аудитория {room_data['number']} в {room_data['building'].name}",
                }
            )
            if created:
                self.stdout.write(f'Created room: {room.building.name} - {room.number}')
            else:
                self.stdout.write(f'Room already exists: {room.building.name} - {room.number}')

        self.stdout.write(self.style.SUCCESS('Successfully created test campus data!'))
