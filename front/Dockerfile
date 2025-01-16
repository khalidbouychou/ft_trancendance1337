FROM node:20-alpine
RUN apk update && apk add curl
RUN apk add --no-cache wget
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build 
CMD ["npm" , "run" , "dev"]
