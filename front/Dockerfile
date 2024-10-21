FROM node:16


WORKDIR /app

RUN npm install -g npm@8.1.2
COPY package*.json ./
COPY . .

CMD npm install && npm run dev