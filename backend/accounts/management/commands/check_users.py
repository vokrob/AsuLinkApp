from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import UserProfile, TeacherEmail


class Command(BaseCommand):
    help = 'Check users and their roles'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Checking users'))

        # Check existing users
        users = User.objects.all()
        self.stdout.write(f'\nTotal users: {users.count()}')

        for user in users:
            if hasattr(user, 'profile'):
                role_display = dict(UserProfile.ROLE_CHOICES).get(user.profile.role, user.profile.role)
                self.stdout.write(f'   {user.username} ({user.email}) → {role_display}')
            else:
                self.stdout.write(f'   {user.username} ({user.email}) → No profile')

        # Check teacher emails
        teacher_emails = TeacherEmail.objects.filter(is_active=True)
        self.stdout.write(f'\nTeacher emails: {teacher_emails.count()}')
        for teacher in teacher_emails:
            self.stdout.write(f'   {teacher.email} ({teacher.department})')

        self.stdout.write(self.style.SUCCESS('\nCheck completed'))
