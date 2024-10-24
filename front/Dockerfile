FROM node:20
WORKDIR /app
# Copy package files first
COPY package*.json ./
# Copy rest of the application
COPY . .
# Command to run the application
CMD npm i && npm run dev
