FROM node:20
WORKDIR /app
COPY ./package*.json ./
COPY . .
# RUN npm run build
# The production build will be served by Nginx, so no need to run dev server
CMD ["npm", "run", "build"]