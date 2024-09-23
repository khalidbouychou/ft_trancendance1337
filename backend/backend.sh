make migrate_all
export DJANGO_SETTINGS_MODULE=api.settings
python3 manage.py runserver

daphne -e ssl:8000:privateKey=/app/certs/key.key:certKey=/app/certs/cert.crt backend.asgi:application