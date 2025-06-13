from django.core.management.base import BaseCommand
from accounts.models import TeacherEmail


class Command(BaseCommand):
    help = 'Добавляет email преподавателя в базу данных'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email адрес преподавателя')
        parser.add_argument('--department', type=str, help='Кафедра', default='')
        parser.add_argument('--position', type=str, help='Должность', default='')

    def handle(self, *args, **options):
        email = options['email']
        department = options['department']
        position = options['position']

        try:
            teacher_email, created = TeacherEmail.objects.get_or_create(
                email=email,
                defaults={
                    'department': department,
                    'position': position,
                }
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Добавлен email преподавателя: {email}')
                )
                if department:
                    self.stdout.write(f'   Кафедра: {department}')
                if position:
                    self.stdout.write(f'   Должность: {position}')
            else:
                self.stdout.write(
                    self.style.WARNING(f'⚠️ Email {email} уже существует в базе данных')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Ошибка при добавлении email: {str(e)}')
            )
