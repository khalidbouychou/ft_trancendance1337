run:
	python3 manage.py runserver 0.0.0.0:8000

migrate_all : clean
	python3 manage.py makemigrations  login
	# chat userprofile pongame secondgame
	python3 manage.py migrate

clean:
	rm -rf login/migrations login/__pycache__
