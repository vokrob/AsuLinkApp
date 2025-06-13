from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import UserProfile, TeacherEmail


class Command(BaseCommand):
    help = 'Проверяет пользователей и их роли'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('👥 Проверка пользователей'))
        
        # Проверяем существующих пользователей
        users = User.objects.all()
        self.stdout.write(f'\n📊 Всего пользователей: {users.count()}')
        
        for user in users:
            if hasattr(user, 'profile'):
                role_display = dict(UserProfile.ROLE_CHOICES).get(user.profile.role, user.profile.role)
                self.stdout.write(f'   👤 {user.username} ({user.email}) → {role_display}')
            else:
                self.stdout.write(f'   👤 {user.username} ({user.email}) → Нет профиля')
        
        # Проверяем email преподавателей
        teacher_emails = TeacherEmail.objects.filter(is_active=True)
        self.stdout.write(f'\n📧 Email преподавателей: {teacher_emails.count()}')
        for teacher in teacher_emails:
            self.stdout.write(f'   📧 {teacher.email} ({teacher.department})')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Проверка завершена'))
