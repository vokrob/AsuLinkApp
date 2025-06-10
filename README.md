# AsuLinkApp

A social networking mobile application built with React Native frontend and Django REST API backend.

## Description

AsuLinkApp is a mobile application developed for students of Astrakhan State University. The application provides social networking features, including:

- 📱 **News Feed** - view and create posts
- 💬 **Messages** - communication between users  
- 📅 **Events** - information about university events
- 🗺️ **Map** - campus navigation
- 👤 **Profile** - personal information management

## Technologies

### Frontend (React Native)
- **React Native 0.79.2** with TypeScript
- **Expo SDK 53** for development and building
- **React Navigation** for screen navigation
- **Gesture Handler** for gestures and animations
- **Vector Icons** for interface icons

### Backend (Django)
- **Django 5.1.4** with SQLite database
- **Django REST Framework** for API
- **Django Allauth** for authentication
- **CORS Headers** for mobile request support

## Project Structure

```
AsuLinkApp/
├── backend/                 # Django REST API Backend
│   ├── asulinkapp_backend/  # Django project settings
│   ├── accounts/            # User authentication and profiles
│   ├── posts/               # Posts, comments, likes models
│   ├── api/                 # REST API endpoints
│   ├── requirements.txt     # Python dependencies
│   ├── manage.py           # Django management script
│   └── db.sqlite3          # SQLite database
├── src/                    # React Native Frontend
│   ├── components/         # Reusable components
│   │   ├── Navigation/     # Navigation components
│   │   ├── Menu/           # Menu components
│   │   └── Posts/          # Post-related components
│   ├── screens/            # Application screens
│   ├── services/           # API service layer
│   ├── contexts/           # React contexts
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── navigation/         # Navigation configuration
├── android/                # Android-specific files
├── assets/                 # Static assets
├── App.tsx                 # Main React Native component
├── package.json            # Node.js dependencies
└── README.md              # This file
```

## Installation and Setup

### Requirements

- **Node.js** 18+ and npm
- **Python** 3.8+
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Backend (Django)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server:**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Frontend (React Native)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Expo development server:**
   ```bash
   npm start
   ```

3. **Run on device/emulator:**
   ```bash
   npm run android  # For Android
   npm run ios      # For iOS
   ```

## Features

### ✅ Implemented

#### Authentication
- 📧 **Registration with email verification**
- 🔐 **Login with username or email**
- 🔑 **Token-based authentication**
- 📱 **Django Allauth integration**

#### News Feed
- 📝 **Create posts with text and images**
- ❤️ **Like system**
- 💬 **Comments on posts**
- 👁️ **View counters**
- 🔄 **Pull-to-refresh updates**

#### Interface
- 🎨 **Dark and light themes**
- 📱 **Responsive design**
- 🧭 **Bottom Tab navigation**
- 🔔 **Notification system**

### 🚧 In Development

- 💬 **Messaging system**
- 📅 **Events calendar**
- 🗺️ **Interactive campus map**
- 👥 **Friends system**
- 🔍 **User and content search**

## API Endpoints

### Authentication
- `POST /api/auth/send-code/` - Send verification code
- `POST /api/auth/verify-code/` - Verify email code
- `POST /api/auth/complete-profile/` - Complete registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/me/` - Current user info

### Posts
- `GET /api/posts/` - List posts
- `POST /api/posts/` - Create post
- `GET /api/posts/{id}/` - Specific post
- `POST /api/posts/{id}/like/` - Like/unlike
- `POST /api/posts/{id}/view/` - Increment views

### Users
- `GET /api/profile/` - User profile
- `GET /api/users/{id}/` - User information

## Configuration

### Backend
- **Database**: SQLite (for development)
- **Email backend**: Console (for development)
- **CORS**: Configured for React Native
- **Static files**: Served in development mode

### Frontend
- **API URL**: `http://192.168.1.73:8000/api` (update for your network)
- **Authentication**: Token-based
- **Navigation**: Stack + Bottom Tab

## Development

### Testing
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
npm test
```

### Production Build
```bash
# Android APK
npm run android

# iOS build
npm run ios
```

## Contributors

- **Developer**: Danil Borkov
- **University**: Astrakhan State University
- **Faculty**: Mathematics and Information Technologies

## License

This project is created for educational purposes for Astrakhan State University.
