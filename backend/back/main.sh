#!/bin/bash


# sleep 10
# bash back/nginx_ssl.sh
sleep 5
bash back/backend.sh
sleep 5

python api/asgi.py