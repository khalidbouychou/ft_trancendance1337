#!bin/bash

echo "-------------------------- Starting backend server ------------------------------------"
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete
find . -type d -name "__pycache__" -exec rm -r {} +
python3 manage.py makemigrations login
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
