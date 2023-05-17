FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

ARG PORT=3000
ENV PORT=$PORT

ARG HOST
ENV HOST=$HOST
RUN npm run build

CMD npm run dev -- --host $HOST --port $PORT