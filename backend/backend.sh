make migrate_all
export DJANGO_SETTINGS_MODULE=api.settings
make prod
daphne -e ssl:8000:privateKey=/app/certs/key.key:certKey=/app/certs/cert.crt api.asgi:application