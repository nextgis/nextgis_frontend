
FROM node:20 as build

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build


FROM nginx:stable-alpine-slim as prod

COPY --from=build /app/dist/spa /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
