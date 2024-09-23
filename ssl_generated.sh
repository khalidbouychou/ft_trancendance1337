#!/bin/bash

# Get domain and validity period
DOMAIN=${1:-$(hostname)}
DAYS=${2:-365}

# Create directories
mkdir -p ./backend/certs || { echo "Error creating backend directory."; exit 1; }
mkdir -p ./frontend/certs || { echo "Error creating frontend directory."; exit 1; }

# Generate SSL certificates
openssl req -newkey rsa:2048 -nodes -keyout ./backend/certs/key.key -x509 -days "$DAYS" -out ./backend/certs/cert.crt -subj "/CN=$DOMAIN" || { echo "Error generating certificates."; exit 1; }

# Copy certificates to frontend
cp ./backend/certs/key.key ./frontend/certs/ || { echo "Error copying key."; exit 1; }
cp ./backend/certs/cert.crt ./frontend/certs/ || { echo "Error copying certificate."; exit 1; }
