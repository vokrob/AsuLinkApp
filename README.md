# AsuLinkApp

Мобильное приложение социальной сети для студентов и преподавателей Алтайского государственного университета.

## Технологии

- **React Native 0.79.3** с TypeScript и Expo SDK 53
- **Django 5.1.4** с SQLite и Django REST Framework
- **Django Allauth** для аутентификации с email верификацией

## Установка

### Бэкенд
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Фронтенд
```bash
npm install
npm start
```

**Настройка:** Обновите IP адрес в `src/services/api.ts` для работы на физических устройствах.

## Функциональность

- **Аутентификация** - регистрация с email верификацией, автоматическое назначение ролей
- **Лента новостей** - посты с изображениями, лайки, комментарии
- **События** - календарь мероприятий с участием и отзывами
- **Карта кампуса** - корпуса и аудитории с системой рейтингов
- **Сообщения** - чаты между пользователями
- **Профили** - разные формы для студентов и преподавателей

## Основные API эндпоинты

- **Аутентификация**: `/api/auth/` - регистрация, вход, верификация
- **Посты**: `/api/posts/` - создание, лайки, комментарии
- **События**: `/api/events/` - календарь, участие, отзывы
- **Кампус**: `/api/campus/` - корпуса, аудитории, рейтинги
- **Профили**: `/api/profile/` - управление профилем пользователя

## Система ролей

- **Студент** - назначается по умолчанию
- **Преподаватель** - назначается автоматически по email адресу

```bash
# Добавить email преподавателя
python manage.py add_teacher_email teacher@asu.edu.ru --department "Кафедра ИТ" --position "Доцент"
```

## Тестирование

```bash
# Бэкенд
cd backend
python manage.py test

# Фронтенд
npm test
```

## Создание тестовых данных

```bash
python manage.py create_test_campus_data
python manage.py create_test_events_data
```
