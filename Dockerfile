FROM node:18.17.0-alpine3.18 AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn test

RUN yarn build


FROM node:slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY --from=builder usr/src/app/dist ./dist

ENTRYPOINT [ "node", "dist/main/server.js" ]