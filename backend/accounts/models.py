from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
import random
import string


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return None


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
    else:
        UserProfile.objects.create(user=instance)


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
