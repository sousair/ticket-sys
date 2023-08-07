FROM node:18.17.0-alpine3.18 AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn test

RUN yarn build

FROM node:slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=builder /usr/src/app/dist ./dist

COPY .env .

CMD [ "node", "dist/main/server.js" ]