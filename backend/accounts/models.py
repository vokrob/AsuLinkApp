from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
import random
import string


class TeacherEmail(models.Model):
    """Model for storing teacher email addresses"""
    email = models.EmailField(unique=True, verbose_name="Teacher email")
    department = models.CharField(max_length=200, blank=True, verbose_name="Department")
    position = models.CharField(max_length=100, blank=True, verbose_name="Position")
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, verbose_name="Active")

    class Meta:
        verbose_name = "Teacher Email"
        verbose_name_plural = "Teacher Emails"
        ordering = ['email']

    def __str__(self):
        return f"{self.email} ({self.department or 'Department not specified'})"


class UserProfile(models.Model):
    """Extended user profile"""

    ROLE_CHOICES = [
        ('student', 'Student'),
        ('professor', 'Professor'),
        ('admin', 'Administrator'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student', verbose_name="Role")

    # Common fields
    first_name = models.CharField(max_length=150, blank=True, verbose_name="First name")
    last_name = models.CharField(max_length=150, blank=True, verbose_name="Last name")
    middle_name = models.CharField(max_length=150, blank=True, verbose_name="Middle name")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    # Student fields
    faculty = models.CharField(max_length=200, blank=True, verbose_name="Faculty/Institute")
    group = models.CharField(max_length=50, blank=True, verbose_name="Group")
    course = models.IntegerField(null=True, blank=True, verbose_name="Course")

    # Professor fields
    department = models.CharField(max_length=200, blank=True, verbose_name="Department")
    position = models.CharField(max_length=100, blank=True, verbose_name="Position")

    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        role_display = dict(self.ROLE_CHOICES).get(self.role, self.role)
        return f"{self.user.get_full_name() or self.user.username} ({role_display})"

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        else:
            # Временно: возвращаем placeholder аватарку для тестирования
            if self.first_name and self.last_name:
                initials = f"{self.first_name[0]}{self.last_name[0]}"
                # Генерируем цвет на основе имени пользователя
                colors = ['4A90E2', '50C878', 'FF6B6B', 'FFD93D', 'B481FF', 'FF9F40']
                color_index = hash(self.user.username) % len(colors)
                color = colors[color_index]
                return f"https://via.placeholder.com/100x100/{color}/FFFFFF?text={initials}"
        return None

    @property
    def full_name(self):
        """Returns full name of user from profile"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        else:
            # Fallback to User model data
            return self.user.get_full_name() or self.user.username

    @classmethod
    def determine_role_by_email(cls, email):
        """Determines user role by email address"""
        if TeacherEmail.objects.filter(email=email, is_active=True).exists():
            return 'professor'
        return 'student'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Creates user profile with automatic role determination"""
    if created:
        # Determine role by email
        role = UserProfile.determine_role_by_email(instance.email)

        # Создаем профиль с определенной ролью
        UserProfile.objects.create(user=instance, role=role)

        print(f"Создан профиль для {instance.username} ({instance.email}) с ролью: {role}")


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Сохраняет профиль пользователя или создает его если не существует"""
    if hasattr(instance, 'profile'):
        instance.profile.save()
    else:
        # Определяем роль по email
        role = UserProfile.determine_role_by_email(instance.email)
        UserProfile.objects.create(user=instance, role=role)


class EmailVerificationCode(models.Model):
    """Model for storing email verification codes"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes', null=True, blank=True)
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)  # Whether the code is verified

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Code {self.code} for {self.email}"

    @classmethod
    def generate_code(cls, email, user=None):
        """Generates new verification code for email (with or without user)"""
        # Delete old unused codes for this email
        cls.objects.filter(email=email, is_used=False).delete()

        # Генерируем 6-значный код
        code = ''.join(random.choices(string.digits, k=6))

        # Код действителен 15 минут
        expires_at = timezone.now() + timezone.timedelta(minutes=15)

        # Создаем новый код
        verification_code = cls.objects.create(
            user=user,  # Может быть None для первичной верификации
            email=email,
            code=code,
            expires_at=expires_at
        )

        return verification_code

    def is_valid(self):
        """Проверяет, действителен ли код"""
        return (
            not self.is_used and
            timezone.now() < self.expires_at and
            self.attempts < 3
        )

    def verify(self, input_code):
        """Проверяет введенный код"""
        self.attempts += 1
        self.save()

        if not self.is_valid():
            return False

        if self.code == input_code:
            self.is_used = True
            self.is_verified = True
            self.save()
            return True

        return False
