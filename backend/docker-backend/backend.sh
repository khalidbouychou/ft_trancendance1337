#!bin/bash
echo "-------------------------- Starting backend server ------------------------------------"

python manage.py makemigrations login chat matches notification pongame
python manage.py migrate
sleep 10
python manage.py bot
python manage.py runserver 0.0.0.0:8000