FROM node:20-alpine

WORKDIR /khbouych

COPY . .

RUN npm i && npm run build

EXPOSE 5173
CMD ["npm", "run", "dev"]
# CMD npm i && npm run build && npm run preview