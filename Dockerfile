FROM node:16

WORKDIR /usr/app/clean-node-api

COPY ./package.json .
RUN npm install --only=prod
