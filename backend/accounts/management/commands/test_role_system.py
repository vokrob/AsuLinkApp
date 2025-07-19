from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import UserProfile, TeacherEmail


class Command(BaseCommand):
    help = 'Тестирует систему автоматического присвоения ролей'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Testing role system'))

        # Check existing teacher emails
        teacher_emails = TeacherEmail.objects.filter(is_active=True)
        self.stdout.write(f'\nRegistered teacher emails:')
        for teacher in teacher_emails:
            self.stdout.write(f'   • {teacher.email} ({teacher.department})')

        if not teacher_emails.exists():
            self.stdout.write(self.style.WARNING('No registered teacher emails'))
            return

        # Test role determination
        test_emails = [
            'rem6637@gmail.com',  # Teacher
            'student@example.com',  # Student
            'test@asu.edu.ru'  # Student
        ]

        self.stdout.write(f'\nTesting role determination:')
        for email in test_emails:
            role = UserProfile.determine_role_by_email(email)
            role_display = 'Teacher' if role == 'professor' else 'Student'
            self.stdout.write(f'   • {email} → {role_display}')

        # Check existing users
        self.stdout.write(f'\nExisting users:')
        users = User.objects.all()
        for user in users:
            if hasattr(user, 'profile'):
                role_display = dict(UserProfile.ROLE_CHOICES).get(user.profile.role, user.profile.role)
                self.stdout.write(f'   • {user.username} ({user.email}) → {role_display}')
            else:
                self.stdout.write(f'   • {user.username} ({user.email}) → No profile')

        self.stdout.write(self.style.SUCCESS('\nTesting completed'))
