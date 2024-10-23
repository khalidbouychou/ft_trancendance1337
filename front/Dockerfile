FROM node:20
WORKDIR /app
# Copy package files first
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy rest of the application
COPY . .
# Command to run the application
CMD npm run dev
