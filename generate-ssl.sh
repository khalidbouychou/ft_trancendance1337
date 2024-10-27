#!/bin/bash

DOMAIN=$(hostname)

mkdir -p ./backend/certs
mkdir -p ./front/certs

openssl req -newkey rsa:2048 -nodes -keyout ./backend/certs/key.key -x509 -days 365 -out ./backend/certs/cert.crt -subj "/CN=$DOMAIN"

cp ./backend/certs/key.key ./front/certs/
cp ./backend/certs/cert.crt ./front/certs/