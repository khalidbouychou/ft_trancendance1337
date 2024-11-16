#!bin/bash

echo "-------------------------- Starting backend server ------------------------------------"

python3 manage.py makemigrations login
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
