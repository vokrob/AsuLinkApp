from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import UserProfile, TeacherEmail


class Command(BaseCommand):
    help = 'Тестирует систему автоматического присвоения ролей'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🧪 Тестирование системы ролей'))
        
        # Проверяем существующие email преподавателей
        teacher_emails = TeacherEmail.objects.filter(is_active=True)
        self.stdout.write(f'\n📧 Зарегистрированные email преподавателей:')
        for teacher in teacher_emails:
            self.stdout.write(f'   • {teacher.email} ({teacher.department})')
        
        if not teacher_emails.exists():
            self.stdout.write(self.style.WARNING('⚠️ Нет зарегистрированных email преподавателей'))
            return
        
        # Тестируем определение роли
        test_emails = [
            'rem6637@gmail.com',  # Преподаватель
            'student@example.com',  # Студент
            'test@asu.edu.ru'  # Студент
        ]
        
        self.stdout.write(f'\n🔍 Тестирование определения ролей:')
        for email in test_emails:
            role = UserProfile.determine_role_by_email(email)
            role_display = 'Преподаватель' if role == 'professor' else 'Студент'
            self.stdout.write(f'   • {email} → {role_display}')
        
        # Проверяем существующих пользователей
        self.stdout.write(f'\n👥 Существующие пользователи:')
        users = User.objects.all()
        for user in users:
            if hasattr(user, 'profile'):
                role_display = dict(UserProfile.ROLE_CHOICES).get(user.profile.role, user.profile.role)
                self.stdout.write(f'   • {user.username} ({user.email}) → {role_display}')
            else:
                self.stdout.write(f'   • {user.username} ({user.email}) → Нет профиля')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Тестирование завершено'))
