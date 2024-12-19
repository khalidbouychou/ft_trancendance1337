FROM node:20-alpine

WORKDIR /khbouych
RUN npm install -g vite@5.4.9
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173
CMD ["npm", "run", "dev"]
# CMD npm i && npm run build && npm run preview