FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY . /app

# Change permission for backend.sh
RUN chmod +x /app/bd/back/backend.sh

# Command to run the script
CMD ["bash", "/app/bd/back/backend.sh"]

