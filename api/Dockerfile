FROM python:3.8-slim

RUN pip install --upgrade pip

COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY . /backend
WORKDIR /backend

COPY ./setup.sh .
ENTRYPOINT ["sh", "/backend/setup.sh"]