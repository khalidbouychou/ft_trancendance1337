FROM python:3.11
RUN apt-get update && apt-get install -y postgresql-client
WORKDIR /app
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN chmod +x backend.sh
CMD ["bash", "docker-backend/backend.sh"]
