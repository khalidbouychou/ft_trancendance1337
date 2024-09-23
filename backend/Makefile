run:
	python3 manage.py runserver 0.0.0.0:8000

migrate:
	python3 manage.py makemigrations && python3 manage.py migrate

useradmin:
	python3 manage.py createsuperuser
	
prod:
	python3 manage.py runserver 0.0.0.0:8000

migrate_all : clean
	python3 manage.py makemigrations  login 
	# chat userprofile pongame secondgame
	python3 manage.py migrate

clean:
	rm -rf login/migrations login/__pycache__ 
	# rm -rf userprofile/migrations userprofile/__pycache__
	# rm -rf chat/migrations chat/__pycache__
	# rm -rf pongame/migrations pongame/__pycache__
	# rm -rf secondgame/migrations secondgame/__pycache__
