#!/bin/bash

# Variables
CERT_DIR="./certs"          # Directory to store the certificate
CERT_NAME="cert.pem"        # Name of the certificate file
DAYS_VALID=365              # Validity in days
DOMAIN_NAME="10.13.6.3"     # Change to your domain or IP

# Create the directory for the certificate if it doesn't exist
mkdir -p $CERT_DIR

# Generate a self-signed SSL certificate
echo "Generating self-signed SSL certificate..."
openssl req -nodes -new -x509 -keyout $CERT_DIR/$CERT_NAME -out $CERT_DIR/$CERT_NAME -days $DAYS_VALID -subj "/CN=$DOMAIN_NAME"

echo "SSL certificate generated at $CERT_DIR/$CERT_NAME"
