#!bin/bash

	python3 manage.py makemigrations
	python3 manage.py migrate
	python3 manage.py runserver 0.0.0.0:8000

    daphne -e ssl:8000:privateKey=/path/to/private/key.pem:certKey=/path/to/certificate/cert.pem your_app.asgi:application


