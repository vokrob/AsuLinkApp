from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from allauth.account.models import EmailAddress
from posts.models import Post, Comment, Like
from accounts.models import UserProfile, EmailVerificationCode
from .serializers import (
    PostSerializer, PostCreateSerializer, CommentSerializer,
    CommentCreateSerializer, UserSerializer, UserProfileSerializer
)


def send_verification_code(email, user=None):
    """Отправляет код верификации на email через Django email backend"""
    try:
        # Генерируем новый код
        verification_code = EmailVerificationCode.generate_code(email, user)

        # Подготавливаем данные для шаблона
        user_name = None
        if user:
            user_name = user.get_full_name() or user.username
        else:
            user_name = email.split('@')[0]

        context = {
            'verification_code': verification_code.code,
            'user_name': user_name,
            'email': email
        }

        # Рендерим шаблоны
        subject = f"[AsuLinkApp] Код подтверждения: {verification_code.code}"
        text_content = render_to_string('account/email/email_confirmation_message.txt', context)
        html_content = render_to_string('account/email/email_confirmation_message.html', context)

        # Отправляем email через Django
        send_mail(
            subject=subject,
            message=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_content,
            fail_silently=False,
        )

        print(f"📧 Код верификации {verification_code.code} отправлен на {email}")
        return verification_code

    except Exception as e:
        print(f"❌ Ошибка отправки кода: {str(e)}")
        raise e


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """Вход в систему с поддержкой username/email и проверкой верификации"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({
            'success': False,
            'error': 'Имя пользователя и пароль обязательны',
            'code': 'MISSING_CREDENTIALS'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Попробуем аутентификацию по username
    user = authenticate(username=username, password=password)

    # Если не получилось, попробуем по email
    if not user:
        try:
            user_by_email = User.objects.get(email=username)
            user = authenticate(username=user_by_email.username, password=password)
        except User.DoesNotExist:
            pass

    if not user:
        return Response({
            'success': False,
            'error': 'Неверные учетные данные',
            'code': 'INVALID_CREDENTIALS'
        }, status=status.HTTP_401_UNAUTHORIZED)

    # Проверяем подтверждение email
    try:
        email_address = EmailAddress.objects.get(user=user, primary=True)
        if not email_address.verified:
            return Response({
                'success': False,
                'error': 'Email не подтвержден',
                'code': 'EMAIL_NOT_VERIFIED',
                'email_verification_required': True,
                'email': user.email,
                'message': 'Пожалуйста, подтвердите ваш email адрес'
            }, status=status.HTTP_403_FORBIDDEN)
    except EmailAddress.DoesNotExist:
        # Создаем EmailAddress если его нет
        EmailAddress.objects.create(
            user=user,
            email=user.email,
            primary=True,
            verified=False
        )
        return Response({
            'success': False,
            'error': 'Email не подтвержден',
            'code': 'EMAIL_NOT_VERIFIED',
            'email_verification_required': True,
            'email': user.email,
            'message': 'Необходимо подтвердить email адрес'
        }, status=status.HTTP_403_FORBIDDEN)

    # Активируем пользователя если email подтвержден
    if not user.is_active:
        user.is_active = True
        user.save()

    # Создаем или получаем токен
    token, created = Token.objects.get_or_create(user=user)

    print(f"✅ Пользователь {user.username} успешно вошел в систему")

    return Response({
        'success': True,
        'token': token.key,
        'user': UserSerializer(user).data,
        'message': 'Login successful'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_root(request):
    """Root API endpoint with information about available endpoints"""
    return Response({
        'message': 'AsuLinkApp API',
        'version': '1.0.0',
        'status': 'running',
        'endpoints': {
            'authentication': {
                'send_code': '/api/auth/send-code/',
                'verify_code': '/api/auth/verify-code/',
                'complete_profile': '/api/auth/complete-profile/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
                'current_user': '/api/auth/me/',
                'refresh_token': '/api/auth/refresh-token/',
                'resend_code': '/api/auth/resend-code/',
            },
            'posts': {
                'list_create': '/api/posts/',
                'detail': '/api/posts/{id}/',
                'like': '/api/posts/{id}/like/',
                'view': '/api/posts/{id}/view/',
                'comments': '/api/posts/{id}/comments/',
            },
            'user': {
                'profile': '/api/profile/',
                'detail': '/api/users/{id}/',
            },
            'test': '/api/test/',
        },
        'documentation': {
            'admin': '/admin/',
            'django_allauth': '/accounts/',
        }
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def test_api(request):
    """Test endpoint for API functionality check"""
    return Response({
        'status': 'API is working!',
        'message': 'Server is running and ready to work',
        'available_endpoints': [
            '/api/auth/send-code/ (POST)',
            '/api/auth/verify-code/ (POST)',
            '/api/auth/complete-profile/ (POST)',
            '/api/auth/login/ (POST)',
            '/api/test/ (GET)'
        ]
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def send_email_code(request):
    """Шаг 1: Отправка кода на email"""
    try:
        email = request.data.get('email')

        if not email:
            return Response(
                {'error': 'Email обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Валидация email формата
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {'error': 'Неверный формат email адреса'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем, не зарегистрирован ли уже этот email
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Пользователь с таким email уже зарегистрирован'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Отправляем код верификации
        verification_code = send_verification_code(email)

        print(f"📧 Код верификации отправлен на: {email}")

        return Response({
            'message': 'Код подтверждения отправлен на ваш email',
            'email': email,
            'code_expires_in_minutes': 15
        })

    except Exception as e:
        print(f"❌ Ошибка при отправке кода: {str(e)}")
        return Response(
            {'error': f'Ошибка сервера: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email_code_step(request):
    """Шаг 2: Проверка кода верификации"""
    try:
        email = request.data.get('email')
        code = request.data.get('code')

        if not email or not code:
            return Response(
                {'error': 'Email и код обязательны'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Находим код верификации
        verification_code = EmailVerificationCode.objects.filter(
            email=email,
            is_used=False
        ).order_by('-created_at').first()

        if not verification_code:
            return Response(
                {'error': 'Код верификации не найден или уже использован'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем код
        if verification_code.verify(code):
            print(f"✅ Email {email} успешно подтвержден")

            return Response({
                'message': 'Email успешно подтвержден! Теперь заполните профиль.',
                'email': email,
                'verified': True,
                'next_step': 'complete_profile'
            })
        else:
            # Неверный код
            attempts_left = 3 - verification_code.attempts
            if attempts_left <= 0:
                return Response(
                    {'error': 'Превышено количество попыток. Запросите новый код.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {
                        'error': f'Неверный код. Осталось попыток: {attempts_left}',
                        'attempts_left': attempts_left
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

    except Exception as e:
        print(f"❌ Ошибка при проверке кода: {str(e)}")
        return Response(
            {'error': f'Ошибка сервера: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def complete_profile(request):
    """Шаг 3: Завершение регистрации - создание профиля"""
    try:
        email = request.data.get('email')
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        # Валидация обязательных полей
        if not email:
            return Response(
                {'error': 'Email обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not username:
            return Response(
                {'error': 'Имя пользователя обязательно'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not password:
            return Response(
                {'error': 'Пароль обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка длины пароля
        if len(password) < 6:
            return Response(
                {'error': 'Пароль должен содержать минимум 6 символов'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем, что email был подтвержден
        verified_code = EmailVerificationCode.objects.filter(
            email=email,
            is_verified=True
        ).order_by('-created_at').first()

        if not verified_code:
            return Response(
                {'error': 'Email не подтвержден. Сначала подтвердите email.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка существования пользователя
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Пользователь с таким именем уже существует'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Пользователь с таким email уже существует'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Создание пользователя (сразу активного, так как email уже подтвержден)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_active=True
        )

        # Создание EmailAddress для Django Allauth
        email_address = EmailAddress.objects.create(
            user=user,
            email=email,
            primary=True,
            verified=True  # Уже подтвержден
        )

        # Связываем код верификации с пользователем
        verified_code.user = user
        verified_code.save()

        # Создание токена для автоматического входа
        token, created = Token.objects.get_or_create(user=user)

        # Логирование успешной регистрации
        print(f"✅ Профиль создан для пользователя: {username} ({email})")

        return Response({
            'message': 'Регистрация завершена! Добро пожаловать в AsuLinkApp!',
            'token': token.key,
            'user': UserSerializer(user).data,
            'next_step': 'news_feed'
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"❌ Ошибка при создании профиля: {str(e)}")
        return Response(
            {'error': f'Ошибка сервера: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_email_code(request):
    """Повторная отправка кода на email (для первого этапа)"""
    try:
        email = request.data.get('email')

        if not email:
            return Response(
                {'error': 'Email обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем, не зарегистрирован ли уже этот email
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Пользователь с таким email уже зарегистрирован'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Отправляем новый код верификации
        verification_code = send_verification_code(email)

        print(f"📧 Повторно отправлен код верификации на: {email}")

        return Response({
            'message': 'Новый код подтверждения отправлен на ваш email',
            'email': email,
            'code_expires_in_minutes': 15
        })

    except Exception as e:
        print(f"❌ Ошибка при повторной отправке: {str(e)}")
        return Response(
            {'error': f'Ошибка сервера: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_verification_code(request):
    """Повторная отправка кода подтверждения email"""
    try:
        email = request.data.get('email')

        if not email:
            return Response(
                {'error': 'Email обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Пользователь с таким email не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Проверяем, не подтвержден ли уже email
        try:
            email_address = EmailAddress.objects.get(user=user, email=email)
            if email_address.verified:
                return Response(
                    {'error': 'Email уже подтвержден'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except EmailAddress.DoesNotExist:
            # Создаем EmailAddress если его нет
            email_address = EmailAddress.objects.create(
                user=user,
                email=email,
                primary=True,
                verified=False
            )

        # Отправляем новый код верификации
        verification_code = send_verification_code(user, email)

        print(f"📧 Повторно отправлен код верификации на: {email}")

        return Response({
            'message': 'Новый код подтверждения отправлен на ваш email',
            'email': email,
            'code_expires_in_minutes': 15
        })

    except Exception as e:
        print(f"❌ Ошибка при повторной отправке: {str(e)}")
        return Response(
            {'error': f'Ошибка сервера: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email_code(request):
    """Проверка кода верификации email"""
    try:
        email = request.data.get('email')
        code = request.data.get('code')

        if not email or not code:
            return Response(
                {'error': 'Email и код обязательны'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Пользователь с таким email не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Находим последний неиспользованный код
        verification_code = EmailVerificationCode.objects.filter(
            user=user,
            email=email,
            is_used=False
        ).order_by('-created_at').first()

        if not verification_code:
            return Response(
                {'error': 'Код верификации не найден или уже использован'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем код
        if verification_code.verify(code):
            # Код верный - активируем пользователя
            user.is_active = True
            user.save()

            # Помечаем email как подтвержденный
            try:
                email_address = EmailAddress.objects.get(user=user, email=email)
                email_address.verified = True
                email_address.save()
            except EmailAddress.DoesNotExist:
                EmailAddress.objects.create(
                    user=user,
                    email=email,
                    primary=True,
                    verified=True
                )

            # Создаем токен для автоматического входа
            token, created = Token.objects.get_or_create(user=user)

            print(f"✅ Email {email} успешно подтвержден")

            return Response({
                'message': 'Email успешно подтвержден!',
                'verified': True,
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            # Неверный код
            attempts_left = 3 - verification_code.attempts
            if attempts_left <= 0:
                return Response(
                    {'error': 'Превышено количество попыток. Запросите новый код.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {
                        'error': f'Неверный код. Осталось попыток: {attempts_left}',
                        'attempts_left': attempts_left
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

    except Exception as e:
        print(f"❌ Ошибка при проверке кода: {str(e)}")
        return Response(
            {'error': f'Ошибка сервера: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_email_verification(request):
    """Проверка статуса подтверждения email"""
    email = request.GET.get('email')

    if not email:
        return Response(
            {'error': 'Email параметр обязателен'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
        email_address = EmailAddress.objects.get(user=user, email=email)

        # Проверяем наличие активного кода
        active_code = EmailVerificationCode.objects.filter(
            user=user,
            email=email,
            is_used=False
        ).order_by('-created_at').first()

        return Response({
            'email': email,
            'verified': email_address.verified,
            'user_active': user.is_active,
            'can_login': email_address.verified and user.is_active,
            'has_pending_code': active_code is not None and active_code.is_valid()
        })

    except User.DoesNotExist:
        return Response(
            {'error': 'Пользователь не найден'},
            status=status.HTTP_404_NOT_FOUND
        )
    except EmailAddress.DoesNotExist:
        return Response(
            {'error': 'Email адрес не найден'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """Выход из системы с удалением токена"""
    try:
        request.user.auth_token.delete()
        print(f"✅ Пользователь {request.user.username} вышел из системы")
        return Response({
            'success': True,
            'message': 'Выход выполнен успешно'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': 'Ошибка при выходе из системы'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """Получение информации о текущем пользователе"""
    try:
        user = request.user
        return Response({
            'success': True,
            'user': UserSerializer(user).data,
            'authenticated': True
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': 'Ошибка получения данных пользователя'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def refresh_token(request):
    """Обновление токена аутентификации"""
    try:
        # Удаляем старый токен
        request.user.auth_token.delete()

        # Создаем новый токен
        token = Token.objects.create(user=request.user)

        print(f"✅ Токен обновлен для пользователя {request.user.username}")

        return Response({
            'success': True,
            'token': token.key,
            'message': 'Токен успешно обновлен'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': 'Ошибка обновления токена'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PostCreateSerializer
        return PostSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own posts.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own posts.")
        instance.delete()


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CommentCreateSerializer
        return CommentSerializer

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, id=post_id)
        serializer.save(author=self.request.user, post=post)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_like(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    like, created = Like.objects.get_or_create(post=post, user=request.user)

    if not created:
        like.delete()
        post.likes = max(0, post.likes - 1)
        liked = False
    else:
        post.likes += 1
        liked = True

    post.save()

    return Response({
        'liked': liked,
        'likes_count': post.likes
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def increment_views(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    post.views += 1
    post.save()

    return Response({
        'views': post.views
    })


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# ============================================================================
# НОВЫЕ VIEWS ДЛЯ СТАНДАРТНОЙ РЕГИСТРАЦИИ DJANGO ALLAUTH
# ============================================================================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def allauth_register(request):
    """Стандартная регистрация через Django Allauth с email подтверждением"""
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        # Валидация обязательных полей
        if not username:
            return Response(
                {'error': 'Имя пользователя обязательно'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not email:
            return Response(
                {'error': 'Email обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not password:
            return Response(
                {'error': 'Пароль обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Валидация email формата
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {'error': 'Неверный формат email адреса'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка длины пароля
        if len(password) < 6:
            return Response(
                {'error': 'Пароль должен содержать минимум 6 символов'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка существования пользователя
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Пользователь с таким именем уже существует'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Пользователь с таким email уже существует'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Создание пользователя (неактивного до подтверждения email)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_active=False  # Будет активирован после подтверждения email
        )

        # Создание EmailAddress для Django Allauth
        email_address = EmailAddress.objects.create(
            user=user,
            email=email,
            primary=True,
            verified=False
        )

        # Генерируем код верификации для мобильного приложения
        verification_code = EmailVerificationCode.generate_code(email, user)

        # Отправляем email с кодом (вместо ссылки)
        send_verification_code(email, user)

        print(f"📧 Письмо с кодом {verification_code.code} отправлено на: {email}")
        print(f"👤 Пользователь создан: {username} (неактивен до подтверждения кода)")

        return Response({
            'message': 'Регистрация успешна! Код подтверждения отправлен на ваш email.',
            'email': email,
            'username': username,
            'verification_code_sent': True,
            'requires_verification': True,
            'next_step': 'enter_code',
            'code_expires_in_minutes': 15
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        print(f"❌ Ошибка при регистрации: {str(e)}")
        return Response(
            {'error': f'Ошибка сервера: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def check_email_status(request):
    """Проверка статуса подтверждения email"""
    email = request.GET.get('email')

    if not email:
        return Response(
            {'error': 'Email параметр обязателен'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
        email_address = EmailAddress.objects.get(user=user, email=email)

        return Response({
            'email': email,
            'email_confirmed': email_address.verified,
            'user_active': user.is_active,
            'can_login': email_address.verified and user.is_active,
            'username': user.username
        })

    except User.DoesNotExist:
        return Response(
            {'error': 'Пользователь с таким email не найден'},
            status=status.HTTP_404_NOT_FOUND
        )
    except EmailAddress.DoesNotExist:
        return Response(
            {'error': 'Email адрес не найден'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_confirmation(request):
    """Повторная отправка письма с подтверждением email"""
    try:
        email = request.data.get('email')

        if not email:
            return Response(
                {'error': 'Email обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Пользователь с таким email не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Проверяем, не подтвержден ли уже email
        try:
            email_address = EmailAddress.objects.get(user=user, email=email)
            if email_address.verified:
                return Response(
                    {'error': 'Email уже подтвержден'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except EmailAddress.DoesNotExist:
            # Создаем EmailAddress если его нет
            EmailAddress.objects.create(
                user=user,
                email=email,
                primary=True,
                verified=False
            )

        # Отправляем новое письмо с подтверждением
        send_email_confirmation(request, user, signup=False)

        print(f"📧 Повторно отправлено письмо с подтверждением на: {email}")

        return Response({
            'message': 'Новое письмо с подтверждением отправлено на ваш email',
            'email': email
        })

    except Exception as e:
        print(f"❌ Ошибка при повторной отправке: {str(e)}")
        return Response(
            {'error': f'Ошибка сервера: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_allauth_code(request):
    """Проверка кода для Django Allauth регистрации"""
    try:
        email = request.data.get('email')
        code = request.data.get('code')

        if not email or not code:
            return Response(
                {'error': 'Email и код обязательны'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Находим пользователя
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Пользователь с таким email не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Находим код верификации
        verification_code = EmailVerificationCode.objects.filter(
            user=user,
            email=email,
            is_used=False
        ).order_by('-created_at').first()

        if not verification_code:
            return Response(
                {'error': 'Код верификации не найден или уже использован'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверяем код
        if verification_code.verify(code):
            # Код верный - активируем пользователя и email
            user.is_active = True
            user.save()

            # Помечаем email как подтвержденный в Django Allauth
            try:
                email_address = EmailAddress.objects.get(user=user, email=email)
                email_address.verified = True
                email_address.save()
            except EmailAddress.DoesNotExist:
                EmailAddress.objects.create(
                    user=user,
                    email=email,
                    primary=True,
                    verified=True
                )

            # Создаем токен для автоматического входа
            token, created = Token.objects.get_or_create(user=user)

            print(f"✅ Код подтвержден для {email}, пользователь активирован")

            return Response({
                'message': 'Email успешно подтвержден! Добро пожаловать в AsuLinkApp!',
                'email': email,
                'username': user.username,
                'verified': True,
                'user_activated': True,
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            # Неверный код
            attempts_left = 3 - verification_code.attempts
            if attempts_left <= 0:
                return Response(
                    {'error': 'Превышено количество попыток. Запросите новый код.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {
                        'error': f'Неверный код. Осталось попыток: {attempts_left}',
                        'attempts_left': attempts_left
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

    except Exception as e:
        print(f"❌ Ошибка при проверке кода: {str(e)}")
        return Response(
            {'error': f'Ошибка сервера: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
