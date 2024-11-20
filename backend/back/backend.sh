#!bin/bash

sleep 10
bash back/nginx_ssl.sh
sleep 5
python manage.py makemigrations login chat matches notification pongame
sleep 5
python manage.py migrate
sleep 5
python manage.py runserver 0.0.0.0:8000

# daphne -e ssl:8000:privateKey=/path/to/private/key.pem:certKey=/path/to/certificate/cert.pem api.asgi:application


