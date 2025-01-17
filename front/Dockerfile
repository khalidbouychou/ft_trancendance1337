FROM node:20-alpine
RUN apk update && apk add curl
RUN apk add --no-cache wget
WORKDIR /app
# COPY package*.json ./
COPY . .
CMD npm install -y  && npm run dev
# CMD ["npm" , "run" , "dev"]
