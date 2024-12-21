FROM node:18

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY ./src ./src
RUN rm ./src/.env

EXPOSE 5900
CMD ["node", "src/index.js"]