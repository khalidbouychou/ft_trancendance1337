
all : run

run:
	python3 manage.py runserver 0.0.0.0:8000

migrate_all :
	python3 manage.py makemigrations
	python3 manage.py migrate

clean:
	rm -rf login/migrations login/__pycache__
