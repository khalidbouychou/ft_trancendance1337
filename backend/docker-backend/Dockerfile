FROM python:3.11-alpine
RUN apk update && apk add --no-cache postgresql-client bash
WORKDIR /app
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN chmod +x backend.sh
CMD ["bash", "docker-backend/backend.sh"]
