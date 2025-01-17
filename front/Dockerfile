FROM node:20-alpine
# Add wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app
COPY package*.json ./
COPY . .
CMD npm i && npm run dev