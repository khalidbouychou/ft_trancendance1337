FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY . /app

# RUN apt-get update && apt-get install -y make

RUN chmod +x back/backend.sh

# # Command to run the script
CMD ["bash","back/backend.sh"]

# CMD bash -c "back/backend.sh && tail -f /dev/null"