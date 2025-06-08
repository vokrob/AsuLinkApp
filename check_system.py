#!/usr/bin/env python
"""
System check script for AsuLinkApp
Verifies that both backend and frontend are properly configured
"""
import os
import sys
import subprocess
import json
import requests
from pathlib import Path

def check_python_version():
    """Check Python version"""
    print("🐍 Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print(f"   ✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"   ❌ Python {version.major}.{version.minor}.{version.micro} - Need Python 3.8+")
        return False

def check_node_version():
    """Check Node.js version"""
    print("📦 Checking Node.js version...")
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"   ✅ Node.js {version} - OK")
            return True
        else:
            print("   ❌ Node.js not found")
            return False
    except FileNotFoundError:
        print("   ❌ Node.js not found")
        return False

def check_backend_structure():
    """Check backend directory structure"""
    print("🏗️  Checking backend structure...")
    backend_path = Path("backend")
    
    required_files = [
        "manage.py",
        "requirements.txt",
        "asulinkapp_backend/settings.py",
        "accounts/models.py",
        "posts/models.py",
        "api/views.py",
        "api/serializers.py"
    ]
    
    missing_files = []
    for file_path in required_files:
        full_path = backend_path / file_path
        if not full_path.exists():
            missing_files.append(file_path)
    
    if not missing_files:
        print("   ✅ All backend files present")
        return True
    else:
        print(f"   ❌ Missing files: {', '.join(missing_files)}")
        return False

def check_frontend_structure():
    """Check frontend directory structure"""
    print("📱 Checking frontend structure...")
    
    required_files = [
        "package.json",
        "src/services/api.ts",
        "src/screens/LoginScreen.tsx",
        "src/navigation/AppNavigator.tsx"
    ]
    
    missing_files = []
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
    
    if not missing_files:
        print("   ✅ All frontend files present")
        return True
    else:
        print(f"   ❌ Missing files: {', '.join(missing_files)}")
        return False

def check_backend_dependencies():
    """Check if backend dependencies are installed"""
    print("📚 Checking backend dependencies...")
    try:
        import django
        import rest_framework
        import allauth
        import corsheaders
        print(f"   ✅ Django {django.get_version()}")
        print(f"   ✅ DRF {rest_framework.VERSION}")
        print("   ✅ Django Allauth")
        print("   ✅ CORS Headers")
        return True
    except ImportError as e:
        print(f"   ❌ Missing dependency: {e}")
        return False

def check_frontend_dependencies():
    """Check if frontend dependencies are installed"""
    print("📦 Checking frontend dependencies...")
    
    if not Path("package.json").exists():
        print("   ❌ package.json not found")
        return False
    
    if not Path("node_modules").exists():
        print("   ❌ node_modules not found - run 'npm install'")
        return False
    
    print("   ✅ Frontend dependencies installed")
    return True

def check_database():
    """Check if database is set up"""
    print("🗄️  Checking database...")
    db_path = Path("backend/db.sqlite3")
    
    if db_path.exists():
        print("   ✅ Database file exists")
        return True
    else:
        print("   ❌ Database not found - run 'python manage.py migrate'")
        return False

def check_api_server():
    """Check if API server is running"""
    print("🌐 Checking API server...")
    try:
        response = requests.get("http://127.0.0.1:8000/api/posts/", timeout=5)
        if response.status_code == 200:
            print("   ✅ API server is running and responding")
            return True
        else:
            print(f"   ⚠️  API server responding with status {response.status_code}")
            return False
    except requests.exceptions.RequestException:
        print("   ❌ API server not running - start with 'python manage.py runserver'")
        return False

def main():
    """Main system check function"""
    print("🔍 AsuLinkApp System Check")
    print("=" * 50)
    
    checks = [
        ("Python Version", check_python_version),
        ("Node.js Version", check_node_version),
        ("Backend Structure", check_backend_structure),
        ("Frontend Structure", check_frontend_structure),
        ("Backend Dependencies", check_backend_dependencies),
        ("Frontend Dependencies", check_frontend_dependencies),
        ("Database", check_database),
        ("API Server", check_api_server),
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"   ❌ Error during {name} check: {e}")
            results.append((name, False))
        print()
    
    # Summary
    print("📊 Summary")
    print("=" * 50)
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{name:20} {status}")
    
    print(f"\nOverall: {passed}/{total} checks passed")
    
    if passed == total:
        print("\n🎉 All checks passed! System is ready to use.")
        print("\nNext steps:")
        print("1. Start backend: cd backend && python manage.py runserver")
        print("2. Start frontend: npm start")
    else:
        print(f"\n⚠️  {total - passed} checks failed. Please fix the issues above.")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
