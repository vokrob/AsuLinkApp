"""
Middleware для API аутентификации и безопасности
"""

import json
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User


class APIAuthMiddleware(MiddlewareMixin):
    """
    Middleware для обработки API аутентификации
    """
    
    def process_request(self, request):
        """Обрабатывает входящие запросы к API"""
        
        # Проверяем только API endpoints
        if not request.path.startswith('/api/'):
            return None
        
        # Пропускаем публичные endpoints
        public_endpoints = [
            '/api/',
            '/api/test/',
            '/api/auth/login/',
            '/api/auth/send-code/',
            '/api/auth/verify-code/',
            '/api/auth/complete-profile/',
            '/api/auth/resend-code/',
            '/api/auth/register/',
        ]
        
        if request.path in public_endpoints:
            return None
        
        # Проверяем наличие токена в заголовке
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return JsonResponse({
                'success': False,
                'error': 'Токен аутентификации отсутствует',
                'code': 'MISSING_TOKEN'
            }, status=401)
        
        # Проверяем формат токена
        if not auth_header.startswith('Token '):
            return JsonResponse({
                'success': False,
                'error': 'Неверный формат токена. Используйте: Token <your_token>',
                'code': 'INVALID_TOKEN_FORMAT'
            }, status=401)
        
        # Извлекаем токен
        token_key = auth_header.split(' ')[1]
        
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            
            # Проверяем активность пользователя
            if not user.is_active:
                return JsonResponse({
                    'success': False,
                    'error': 'Аккаунт пользователя деактивирован',
                    'code': 'USER_INACTIVE'
                }, status=401)
            
            # Добавляем пользователя в request
            request.user = user
            request.auth = token
            
        except Token.DoesNotExist:
            return JsonResponse({
                'success': False,
                'error': 'Недействительный токен',
                'code': 'INVALID_TOKEN'
            }, status=401)
        
        return None


class APIResponseMiddleware(MiddlewareMixin):
    """
    Middleware для стандартизации ответов API
    """
    
    def process_response(self, request, response):
        """Обрабатывает исходящие ответы API"""
        
        # Обрабатываем только API endpoints
        if not request.path.startswith('/api/'):
            return response
        
        # Добавляем CORS заголовки для мобильного приложения
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        
        # Добавляем заголовки безопасности
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        
        return response


class APIErrorHandlingMiddleware(MiddlewareMixin):
    """
    Middleware для обработки ошибок API
    """
    
    def process_exception(self, request, exception):
        """Обрабатывает исключения в API"""
        
        # Обрабатываем только API endpoints
        if not request.path.startswith('/api/'):
            return None
        
        # Логируем ошибку
        print(f"❌ API Error in {request.path}: {str(exception)}")
        
        # Возвращаем стандартизированный ответ об ошибке
        return JsonResponse({
            'success': False,
            'error': 'Внутренняя ошибка сервера',
            'code': 'INTERNAL_SERVER_ERROR',
            'message': 'Произошла непредвиденная ошибка. Попробуйте позже.'
        }, status=500)


class RequestLoggingMiddleware(MiddlewareMixin):
    """
    Middleware для логирования API запросов
    """
    
    def process_request(self, request):
        """Логирует входящие API запросы"""
        
        # Логируем только API endpoints
        if not request.path.startswith('/api/'):
            return None
        
        # Получаем информацию о пользователе
        user_info = "Anonymous"
        if hasattr(request, 'user') and request.user.is_authenticated:
            user_info = f"User: {request.user.username}"
        
        # Логируем запрос
        print(f"📡 API Request: {request.method} {request.path} - {user_info}")
        
        return None
    
    def process_response(self, request, response):
        """Логирует ответы API"""
        
        # Логируем только API endpoints
        if not request.path.startswith('/api/'):
            return response
        
        # Логируем ответ
        status_emoji = "✅" if 200 <= response.status_code < 300 else "❌"
        print(f"{status_emoji} API Response: {request.method} {request.path} - {response.status_code}")
        
        return response
