
FROM python:3.11

WORKDIR /app

COPY back/requirements.txt .
RUN pip install -r requirements.txt

# Copy the application code
COPY . .

# # Install OpenSSL for certificate generation
# RUN apt-get update && apt-get install -y openssl

# # Generate a self-signed SSL certificate
# RUN mkdir -p /app/certs && \
#     openssl req -nodes -new -x509 -keyout /app/certs/cert.pem -out /app/certs/cert.pem -days 365 -subj "/CN=localhost"

# Set executable permissions on scripts
RUN chmod +x back/main.sh
RUN chmod +x back/backend.sh
# RUN chmod +x back/nginx_ssl.sh

# Command to run the application
CMD ["bash", "back/main.sh"]
