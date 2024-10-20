# FROM python:3.11

# ENV PYTHONDONTWRITEBYTECODE 1

# ENV PYTHONUNBUFFERED 1

# WORKDIR /app

# COPY ./requirements.txt /app/requirements.txt

# RUN pip install --no-cache-dir -r requirements.txt

# COPY . /app

# # RUN apt-get update && apt-get install -y make

# RUN chmod +x back/main.sh
# RUN chmod +x back/backend.sh

# RUN chmod +x back/nginx_ssl.sh

# # # Command to run the script

# CMD ["bash","back/main.sh"]

# # CMD bash -c "back/backend.sh && tail -f /dev/null"


FROM python:3.11

# Environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . /app

# Install OpenSSL for certificate generation
RUN apt-get update && apt-get install -y openssl

# Generate a self-signed SSL certificate
RUN mkdir -p /app/certs && \
    openssl req -nodes -new -x509 -keyout /app/certs/cert.pem -out /app/certs/cert.pem -days 365 -subj "/CN=localhost"

# Set executable permissions on scripts
RUN chmod +x back/main.sh
RUN chmod +x back/backend.sh
RUN chmod +x back/nginx_ssl.sh

# Command to run the application
CMD ["bash", "back/main.sh"]
