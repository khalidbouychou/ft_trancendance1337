FROM node:20-alpine
WORKDIR /app
COPY . .
CMD npm install -y  && npm run dev


# FROM node:20-alpine AS builder
# RUN apk update && apk add curl
# WORKDIR /app
# COPY package*.json ./
# RUN npm i
# COPY . .
# CMD ["npm" , "run" , "dev"]
