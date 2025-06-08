# AsuLinkApp

Мобильное приложение социальной сети для студентов и преподавателей университета с Django REST API backend.

## Структура проекта

```
AsuLinkApp/
├── backend/                 # Django REST API Backend
│   ├── asulinkapp_backend/  # Настройки Django проекта
│   ├── accounts/            # Аутентификация и профили пользователей
│   ├── posts/               # Модели постов, комментариев, лайков
│   ├── api/                 # REST API endpoints
│   ├── requirements.txt     # Python зависимости
│   ├── manage.py           # Django management script
│   └── README.md           # Документация backend
├── src/                    # React Native Frontend
│   ├── components/         # Переиспользуемые компоненты
│   │   ├── Navigation/     # Компоненты навигации
│   │   ├── Menu/           # Компоненты меню
│   │   └── Posts/          # Компоненты для постов
│   ├── contexts/           # React контексты
│   │   └── ThemeContext.tsx # Контекст для управления темой
│   ├── navigation/         # Конфигурация навигации
│   ├── screens/            # Экраны приложения
│   ├── services/           # Сервисы для работы с API
│   ├── types/              # TypeScript типы
│   └── utils/              # Вспомогательные функции
├── assets/                 # Статические ресурсы (изображения, иконки)
└── package.json           # Node.js зависимости
```

## Реализованный функционал

### Backend (Django)
- ✅ **Django 5.1.4** с SQLite базой данных
- ✅ **Django REST Framework** для API endpoints
- ✅ **Django Allauth** для аутентификации (регистрация, вход, верификация email)
- ✅ **Token-based аутентификация** для API доступа
- ✅ **CORS поддержка** для интеграции с frontend
- ✅ **Профили пользователей** с поддержкой аватаров
- ✅ **Система постов** с лайками, комментариями и просмотрами
- ✅ **Админ-панель** для управления контентом

### Frontend (React Native)
- ✅ **React Native** с TypeScript
- ✅ **Expo** для разработки и сборки
- ✅ **React Navigation** для навигации между экранами
- ✅ **Поддержка тем** с контекстом
- ✅ **API интеграция** с Django backend
- ✅ **Аутентификация пользователей**
- ✅ **Лента постов** с социальными функциями

### Планируемый функционал
1. **Сообщения**
   - Чат между пользователями
   - Уведомления о новых сообщениях

2. **Календарь событий**
   - Общий календарь событий университета
   - Персональный календарь с возможностью добавления мероприятий

3. **Интерактивная карта корпусов**
   - Расположение корпусов на карте Барнаула
   - Внутренние карты корпусов
   - Отзывы о аудиториях

## Быстрый старт

### Настройка Backend

1. **Перейти в директорию backend:**
   ```bash
   cd backend
   ```

2. **Активировать виртуальное окружение:**
   ```bash
   # Windows
   .\venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

3. **Установить зависимости:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Выполнить миграции:**
   ```bash
   python manage.py migrate
   ```

5. **Создать тестовые данные:**
   ```bash
   python create_sample_data.py
   ```

6. **Запустить сервер backend:**
   ```bash
   python manage.py runserver
   ```

   Backend будет доступен по адресу: `http://127.0.0.1:8000/`

### Настройка Frontend

1. **Установить зависимости:**
   ```bash
   npm install
   ```

2. **Запустить Expo development server:**
   ```bash
   npm start
   ```

3. **Запуск на устройстве/симуляторе:**
   ```bash
   npm run android  # Для Android
   npm run ios      # Для iOS
   npm run web      # Для веб-браузера
   ```

## API Документация

### Endpoints аутентификации
- `POST /api/auth/login/` - Вход пользователя
- `POST /api/auth/register/` - Регистрация пользователя
- `POST /api/auth/logout/` - Выход пользователя

### Endpoints постов
- `GET /api/posts/` - Список всех постов
- `POST /api/posts/` - Создание нового поста (требует аутентификации)
- `GET /api/posts/{id}/` - Получение конкретного поста
- `POST /api/posts/{id}/like/` - Переключение лайка на посте

### Endpoints пользователей
- `GET /api/profile/` - Получение профиля текущего пользователя
- `PUT /api/profile/` - Обновление профиля пользователя

## Разработка

### Тестирование Backend API
```bash
cd backend
python test_api.py
```

### Запуск Django тестов
```bash
cd backend
python manage.py test
```

### Админ-панель
Доступ к Django админ-панели: `http://127.0.0.1:8000/admin/`
- Логин: `admin`
- Пароль: `admin123`

## Стек технологий

### Backend
- **Django 5.1.4** - Веб-фреймворк
- **Django REST Framework** - API фреймворк
- **Django Allauth** - Аутентификация
- **SQLite** - База данных
- **Python 3.8+** - Язык программирования

### Frontend
- **React Native** - Мобильный фреймворк
- **TypeScript** - Типизация
- **Expo** - Платформа разработки
- **React Navigation** - Навигация
- **AsyncStorage** - Локальное хранилище

## Функции безопасности

- ✅ Token-based аутентификация
- ✅ CSRF защита
- ✅ CORS конфигурация
- ✅ Проверка прав пользователей
- ✅ Поддержка верификации email