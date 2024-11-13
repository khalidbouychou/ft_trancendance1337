#!/bin/bash
mkdir -p ssl
openssl req -newkey rsa:2048 -nodes -keyout ./ssl/ssl.key -x509 -days 365 -out ./ssl/ssl.crt -subj "/CN=127.0.0.1"



