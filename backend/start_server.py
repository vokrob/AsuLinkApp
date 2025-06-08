#!/usr/bin/env python
"""
Script to start the Django development server
"""
import os
import sys
import subprocess
import webbrowser
import time

def start_server():
    print("Starting AsuLinkApp Django Backend Server...")
    print("=" * 50)
    
    # Check if virtual environment is activated
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Virtual environment not detected!")
        print("Please activate the virtual environment first:")
        print("   .\\venv\\Scripts\\activate  (Windows)")
        print("   source venv/bin/activate  (macOS/Linux)")
        return
    
    # Check if Django is installed
    try:
        import django
        print(f"✅ Django {django.get_version()} detected")
    except ImportError:
        print("❌ Django not found! Please install requirements:")
        print("   pip install -r requirements.txt")
        return
    
    # Set Django settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'asulinkapp_backend.settings')
    
    print("\n📊 Server Information:")
    print("   API Base URL: http://127.0.0.1:8000/api/")
    print("   Admin Panel: http://127.0.0.1:8000/admin/")
    print("   Admin Credentials: admin / admin123")
    print("\n🔗 Available Endpoints:")
    print("   GET  /api/posts/                 - List posts")
    print("   POST /api/auth/login/            - User login")
    print("   POST /api/auth/register/         - User registration")
    print("   GET  /api/profile/               - User profile")
    print("\n🚀 Starting server...")
    
    try:
        # Start the Django development server
        subprocess.run([
            sys.executable, 'manage.py', 'runserver', '127.0.0.1:8000'
        ], check=True)
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error starting server: {e}")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")

if __name__ == '__main__':
    start_server()
