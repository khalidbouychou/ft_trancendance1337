#!bin/bash

echo "-------------------------- Starting backend server ------------------------------------"
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete
find . -type d -name "__pycache__" -exec rm -r {} +

echo "-------------------------- generate ssl ------------------------------------"
# Navigate to where you want to store your SSL files
mkdir  ./docker-backend/ssl
# Generate a private key
openssl genpkey -algorithm RSA -out ./docker-backend/ssl/server.key -pkeyopt rsa_keygen_bits:2048

# Generate a self-signed certificate
openssl req -new -x509 -key ./docker-backend/ssl/server.key -out ./docker-backend/ssl/server.crt -days 365
echo "-------------------------- ssl done ------------------------------------"
sleep 2
python3 manage.py makemigrations login
python3 manage.py migrate
python3 manage.py runserver 0.0.0.0:8000
