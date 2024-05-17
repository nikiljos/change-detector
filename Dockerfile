FROM node:20-alpine
COPY . /app
WORKDIR /app
RUN npm install

CMD node index.js