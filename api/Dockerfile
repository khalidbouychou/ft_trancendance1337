FROM python:3.9
ENV PYTHONUNBUFFERED 1
WORKDIR /api
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
COPY . /api