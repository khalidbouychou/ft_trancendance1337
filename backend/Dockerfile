FROM python:3.11

# Install PostgreSQL client tools
RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
RUN chmod +x backend.sh

# Wait for the PostgreSQL container to be running
CMD ["bash", "backend.sh"]
