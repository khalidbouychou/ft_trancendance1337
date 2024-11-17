FROM node:20
WORKDIR /app
COPY ./package*.json ./
COPY . .
CMD npm i && npm run build && npm run preview