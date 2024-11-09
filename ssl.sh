#!/bin/bash

DOMAIN=$(hostname)
mkdir -p ssl

openssl req -newkey rsa:2048 -nodes -keyout ssl/$DOMAIN.key -x509 -days 365 -out ssl/$DOMAIN.crt -subj "/CN=$DOMAIN"