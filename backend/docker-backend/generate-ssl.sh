#!/bin/bash

DOMAIN=$(hostname)
BACKEND=./backend/docker-backend/certs
FRONTEND=./front/docker-backend/certs

mkdir -p $BACKEND
mkdir -p $FRONTEND

openssl req -newkey rsa:2048 -nodes -keyout $BACKEND/$DOMAIN.key -x509 -days 365 -out $BACKEND/$DOMAIN.crt -subj "/CN=$DOMAIN"