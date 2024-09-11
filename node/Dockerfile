FROM node:latest
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN mv ./config.js.example ./config.js
ENV PORT=3000
EXPOSE 3000
CMD [ "npm", "start" ]
