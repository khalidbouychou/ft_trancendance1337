FROM node:20-alpine
WORKDIR /app
COPY ./package*.json ./
COPY . .
CMD npm i && npm run dev
# CMD npm i && npm run dev