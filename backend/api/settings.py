"""
Django settings for api project.

Generated by 'django-admin startproject' using Django 4.2.13.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path 
import os
from datetime import timedelta 
from django.conf import settings
from corsheaders.defaults import default_headers

from dotenv import load_dotenv
# Load the .env file
load_dotenv()
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent  
# Add this setting to the end of the file or before the MIDDLEWARE setting
CSRF_TRUSTED_ORIGINS = [
    'https://localhost',
    'https://10.13.5.6',
]
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production! 
DEBUG = True # Set to False in production

# BACKEND_IP = os.getenv("VITE_BACKEND_IP")

ALLOWED_HOSTS = ['*']

# Application definition

INSTALLED_APPS = [ 
    'daphne',
    'channels',
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework_simplejwt.token_blacklist',
    'rest_framework',
    'login',
    'pongame',
    'matches',
    'notification',
    'Chat2',
    'web3_app'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
 
ASGI_APPLICATION = 'api.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
        # "BACKEND": "channels_redis.core.RedisChannelLayer",
        # "CONFIG": {
        #     "hosts": [("redis", 6379)],  # Use the service name from docker-compose
        # },
    },
} 


ROOT_URLCONF = 'api.urls'
APPEND_SLASH = True
# BASE_DIR = Path(__file__).resolve().parent.parent

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'api.wsgi.application'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/




# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField' 

# CORS settings
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS =  list(default_headers) + [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'withcredentials',  
    'user'
]
#************  khbouych ************ 
# STATIC_URL = 'static/'
STATIC_URL = 'uploads/'


STATICFILES_DIRS = [
    BASE_DIR / "uploads",
    # BASE_DIR / "static",
    
]


# *************** jwt ********* 
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),

}

AUTH_USER_MODEL = 'login.Player'
SIMPLE_JWT = {
   'ACCESS_TOKEN_LIFETIME': timedelta(hours=5),
   'REFRESH_TOKEN_LIFETIME': timedelta(days=90),
   'ROTATE_REFRESH_TOKENS': True,
   'BLACKLIST_AFTER_ROTATION': True,
}

ACCESS_TOKEN_LIFETIME = SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']
REFRESH_TOKEN_LIFETIME = SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']

JWT_COOKIE_SECURE = False # Set to True in production

# These are used for cookie settings
JWT_AUTH_COOKIE = 'access_token' 
JWT_AUTH_REFRESH_COOKIE = 'refresh_token'
JWT_AUTH_SECURE = False  # Set to False in development if not using HTTPS
JWT_AUTH_SAMESITE = 'Lax'
JWT_REFRESH_TOKEN_LIFETIME = REFRESH_TOKEN_LIFETIME

CORS_ALLOW_ALL_ORIGINS = True  # Set to True for development, but not recommended for production

# Read environment variables
ip_frontendl = os.getenv("IP_FRONTEND")
ip_backend = os.getenv("IP_BACKEND") 

CORS_ALLOWED_ORIGINS = [
    'https://localhost',
    'https://localhost:5173',
    'http://localhost',
    'http://localhost:5173',
    "https://10.13.5.6",
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql', 
        'NAME': os.getenv("POSTGRES_DB"),
        'USER': os.getenv("POSTGRES_USER"), 
        'PASSWORD': os.getenv("POSTGRES_PASSWORD"), 
        'HOST': os.getenv("POSTGRES_HOST"),
        'PORT': os.getenv("POSTGRES_PORT"),
    }
}

SECURE_SSL_REDIRECT = True  # Redirect HTTP to HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')  # Tells Django that the request is secure
CSRF_COOKIE_SECURE = True  # Ensure CSRF cookies are only sent over HTTPS
SESSION_COOKIE_SECURE = True  # Ensure session cookies are only sent over HTTPS

USE_X_FORWARDED_HOST = True
