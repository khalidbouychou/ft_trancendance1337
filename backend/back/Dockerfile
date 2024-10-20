FROM python:3.11
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app
RUN apt-get update && apt-get install -y openssl
RUN mkdir -p /app/certs && \
    openssl req -nodes -new -x509 -keyout /app/certs/cert.pem -out /app/certs/cert.pem -days 365 -subj "/CN=10.12.9.9"
RUN chmod +x back/main.sh
RUN chmod +x back/backend.sh
RUN chmod +x back/nginx_ssl.sh
CMD ["bash", "back/main.sh"]
