FROM node:20-alpine
RUN apk update && apk add curl
WORKDIR /app
COPY ./package*.json ./
COPY . .
CMD npm i && npm run dev