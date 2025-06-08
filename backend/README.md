# AsuLinkApp Backend API

Django REST API backend for the AsuLinkApp mobile application.

## Features

- **Django 5.1.4** with SQLite database
- **Django REST Framework** for API endpoints
- **Django Allauth** for authentication (registration, login, email verification, password reset)
- **Token-based authentication** for API access
- **CORS support** for frontend integration
- **User profiles** with avatar support
- **Posts system** with likes, comments, and views
- **Admin interface** for content management

## Setup Instructions

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment:**
   ```bash
   # Windows
   .\venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
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

6. **Create sample data (optional):**
   ```bash
   python create_sample_data.py
   ```

7. **Start development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://127.0.0.1:8000/`

## API Endpoints

### Authentication

- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration  
- `POST /api/auth/logout/` - User logout

### Posts

- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post (authenticated)
- `GET /api/posts/{id}/` - Get specific post
- `PUT/PATCH /api/posts/{id}/` - Update post (owner only)
- `DELETE /api/posts/{id}/` - Delete post (owner only)
- `POST /api/posts/{id}/like/` - Toggle like on post
- `POST /api/posts/{id}/view/` - Increment post views

### Comments

- `GET /api/posts/{post_id}/comments/` - List comments for post
- `POST /api/posts/{post_id}/comments/` - Create comment (authenticated)

### User Profile

- `GET /api/profile/` - Get current user profile
- `PUT/PATCH /api/profile/` - Update user profile
- `GET /api/users/{id}/` - Get specific user profile

### Admin

- `/admin/` - Django admin interface

## Authentication

The API uses token-based authentication. Include the token in the Authorization header:

```
Authorization: Token your_token_here
```

## Environment Variables

Create a `.env` file in the backend directory:

```
DEBUG=True
SECRET_KEY=your_secret_key_here
```

## Database Models

### User Profile
- Extends Django's built-in User model
- Avatar, bio, birth date, location, website fields

### Post
- UUID primary key
- Author (ForeignKey to User)
- Content, image, timestamps
- Likes and views counters

### Comment
- UUID primary key
- Post (ForeignKey to Post)
- Author (ForeignKey to User)
- Content, timestamps

### Like
- Post (ForeignKey to Post)
- User (ForeignKey to User)
- Unique constraint on (post, user)

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Collecting Static Files
```bash
python manage.py collectstatic
```

## Security Features

- CSRF protection enabled
- CORS configured for frontend domains
- Token-based authentication
- User permission checks for post/comment operations
- Email verification for new accounts

## Frontend Integration

The API is configured to work with the React Native frontend. CORS is enabled for:
- `http://localhost:3000`
- `http://localhost:8081` 
- `http://localhost:19006`

Update the `CORS_ALLOWED_ORIGINS` setting in `settings.py` for production deployment.
