FROM node:20-alpine
RUN apk update && apk add curl
RUN apk add --no-cache wget

WORKDIR /app
# COPY ./package*.json ./
COPY . /app
CMD npm i && npm run dev