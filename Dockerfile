FROM node:24-alpine

COPY . /app

WORKDIR /app

RUN npm i

EXPOSE 3333

CMD ["node", "ace", "serve", "--watch"]
