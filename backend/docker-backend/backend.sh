#!bin/bash
echo "-------------------------- Starting backend server ------------------------------------"

python3 manage.py makemigrations login chat matches notification pongame xo_game
python3 manage.py migrate
python3 manage.py bot
python3 manage.py runserver 0.0.0.0:8000