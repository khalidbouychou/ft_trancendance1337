FROM python:3.11

# # Add a sleep utility
# RUN apt-get update && apt-get install -y sleep

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN chmod +x backend.sh
RUN sleep 30
# Wait for the PostgreSQL container to be running
CMD ["bash", "backend.sh"]
