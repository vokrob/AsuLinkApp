from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
import random
import string


class TeacherEmail(models.Model):
    """Модель для хранения email адресов преподавателей"""
    email = models.EmailField(unique=True, verbose_name="Email преподавателя")
    department = models.CharField(max_length=200, blank=True, verbose_name="Кафедра")
    position = models.CharField(max_length=100, blank=True, verbose_name="Должность")
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, verbose_name="Активен")

    class Meta:
        verbose_name = "Email преподавателя"
        verbose_name_plural = "Email преподавателей"
        ordering = ['email']

    def __str__(self):
        return f"{self.email} ({self.department or 'Кафедра не указана'})"


class UserProfile(models.Model):
    """Расширенный профиль пользователя"""

    ROLE_CHOICES = [
        ('student', 'Студент'),
        ('professor', 'Преподаватель'),
        ('admin', 'Администратор'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student', verbose_name="Роль")

    # Общие поля
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    # Поля для студентов
    faculty = models.CharField(max_length=200, blank=True, verbose_name="Факультет/Институт")
    group = models.CharField(max_length=50, blank=True, verbose_name="Группа")
    course = models.IntegerField(null=True, blank=True, verbose_name="Курс")

    # Поля для преподавателей
    department = models.CharField(max_length=200, blank=True, verbose_name="Кафедра")
    position = models.CharField(max_length=100, blank=True, verbose_name="Должность")

    # Системные поля
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"

    def __str__(self):
        role_display = dict(self.ROLE_CHOICES).get(self.role, self.role)
        return f"{self.user.get_full_name() or self.user.username} ({role_display})"

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return None

    @property
    def full_name(self):
        """Возвращает полное имя пользователя"""
        return self.user.get_full_name() or self.user.username

    @classmethod
    def determine_role_by_email(cls, email):
        """Определяет роль пользователя по email адресу"""
        if TeacherEmail.objects.filter(email=email, is_active=True).exists():
            return 'professor'
        return 'student'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Создает профиль пользователя с автоматическим определением роли"""
    if created:
        # Определяем роль по email
        role = UserProfile.determine_role_by_email(instance.email)

        # Создаем профиль с определенной ролью
        UserProfile.objects.create(user=instance, role=role)

        print(f"👤 Создан профиль для {instance.username} ({instance.email}) с ролью: {role}")


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
    """Модель для хранения кодов верификации email"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes', null=True, blank=True)
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    is_verified = models.BooleanField(default=False)  # Подтвержден ли код

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Код {self.code} для {self.email}"

    @classmethod
    def generate_code(cls, email, user=None):
        """Генерирует новый код верификации для email (с пользователем или без)"""
        # Удаляем старые неиспользованные коды для этого email
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
