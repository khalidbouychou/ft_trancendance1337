#!bin/bash

sleep 5
# Find and delete all migration files
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete

# Find and delete all __pycache__ directories
find . -type d -name "__pycache__" -exec rm -r {} +

# python3 manage.py makemigrations login chat matches notification pongame
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000

# daphne -e ssl:8000:privateKey=/path/to/private/key.pem:certKey=/path/to/certificate/cert.pem api.asgi:application


