# Use an official Node.js image as a base image
FROM node:20.9.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port Vite will run on
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]
