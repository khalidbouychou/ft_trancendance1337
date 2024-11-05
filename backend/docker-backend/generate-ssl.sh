#!/bin/bash

DOMAIN=$(hostname)
BACKEND=./backend/docker-backend/certs
FRONTEND=./front/docker-backend/certs

mkdir -p $BACKEND
mkdir -p $FRONTEND

openssl req -newkey rsa:2048 -nodes -keyout $BACKEND/$DOMAIN.key -x509 -days 365 -out $BACKEND/$DOMAIN.crt -subj "/CN=$DOMAIN"

# cp $FRONTEND/$DOMAIN.key $FRONTEND/
# cp $FRONTEND/$DOMAIN.crt $FRONTEND/

# cp $BACKEND/$DOMAIN.key $BACKEND/
# cp $BACKEND/$DOMAIN.crt $BACKEND/