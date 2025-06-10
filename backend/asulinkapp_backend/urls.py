"""
URL configuration for asulinkapp_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.shortcuts import render

def api_info(request):
    """Simple main page with API information"""
    return JsonResponse({
        'message': 'AsuLinkApp Backend API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api_posts': '/api/posts/',
            'api_auth_register': '/api/auth/register/',
            'api_auth_login': '/api/auth/login/',
            'api_profile': '/api/profile/',
        },
        'status': 'running'
    })

def email_confirmed_view(request):
    """Email confirmation success page"""
    return render(request, 'account/email_confirmed.html')

urlpatterns = [
    path('', api_info, name='api_info'),  # Main page
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('accounts/', include('allauth.urls')),
    path('auth/', include('rest_framework.urls')),
    path('email-confirmed/', email_confirmed_view, name='email_confirmed'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
