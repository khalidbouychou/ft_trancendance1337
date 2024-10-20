#!bin/bash

sleep 5
# bash back/nginx_ssl.sh
python3 manage.py makemigrations login chat matches notification pongame
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000

# daphne -e ssl:8000:privateKey=/path/to/private/key.pem:certKey=/path/to/certificate/cert.pem api.asgi:application


