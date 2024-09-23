# Use Node.js 18 Alpine as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Vite globally
RUN npm install -g vite

# Install project dependencies, including Vite locally
RUN npm install --legacy-peer-deps
RUN npm install vite --save-dev

# Copy the rest of the application
COPY . .

# Diagnostic commands
RUN echo "Node.js version:" && node --version
RUN echo "NPM version:" && npm --version
RUN echo "Vite version:" && vite --version
RUN echo "Checking for vite.config.js:" && ls -la /app/vite.config.js
RUN echo "Contents of vite.config.js:" && cat /app/vite.config.js
RUN echo "Checking vite.config.js syntax:" && node -c /app/vite.config.js
RUN echo "Listing Vite in node_modules:" && npm list vite

# Set the command to run the application
CMD ["npm", "run", "dev"]