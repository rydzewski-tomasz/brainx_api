FROM node:16-alpine

COPY . /brainx_api

WORKDIR /brainx_api

RUN apk add --no-cache bash

RUN rm -rf .dockerignore

RUN npm install
