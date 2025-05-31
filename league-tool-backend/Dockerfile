FROM node:22.4.0-alpine AS dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM node:22.4.0-alpine AS build
WORKDIR /usr/src/app
COPY --from=dev /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run compile 

FROM node:22.4.0-alpine as prod
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/lib ./lib
COPY --from=dev /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/public ./public

EXPOSE 3040
CMD ["node", "lib/index.js"]
