ARG NODE_VERSION=10.18.0

FROM node:$NODE_VERSION-alpine as install_dev_dependency
COPY package*.json /tmp/
RUN cd /tmp && npm install

FROM node:$NODE_VERSION-alpine as building
WORKDIR /app
COPY --from=install_dev_dependency /tmp .
COPY . .
RUN npm run build

FROM node:$NODE_VERSION-alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm install -P
COPY .env* ./
COPY config ./config
COPY --from=building /app/.next ./.next
COPY --from=building /app/dist ./dist
ENTRYPOINT ["npm", "run", "start:prod"]