# AsuLinkApp

Mobile social network application for students and faculty of Altai State University.

## Technologies

- **React Native 0.79.3** with TypeScript and Expo SDK 53
- **Django 5.1.4** with SQLite and Django REST Framework
- **Django Allauth** for authentication with email verification

## Installation

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Frontend
```bash
npm install
npm start
```

**Configuration:** Update IP address in `src/services/api.ts` for physical device testing.

## Features

- **Authentication** - registration with email verification, automatic role assignment
- **News Feed** - posts with images, likes, comments
- **Events** - event calendar with participation and reviews
- **Campus Map** - buildings and rooms with rating system
- **Messages** - chat between users
- **Profiles** - different forms for students and faculty

## Main API Endpoints

- **Authentication**: `/api/auth/` - registration, login, verification
- **Posts**: `/api/posts/` - creation, likes, comments
- **Events**: `/api/events/` - calendar, participation, reviews
- **Campus**: `/api/campus/` - buildings, rooms, ratings
- **Profiles**: `/api/profile/` - user profile management

## Role System

- **Student** - assigned by default
- **Faculty** - assigned automatically by email address

```bash
# Add faculty email
python manage.py add_teacher_email teacher@asu.edu.ru --department "IT Department" --position "Associate Professor"
```

## Testing

```bash
# Backend
cd backend
python manage.py test

# Frontend
npm test
```

## Creating Test Data

```bash
python manage.py create_test_campus_data
python manage.py create_test_events_data
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
