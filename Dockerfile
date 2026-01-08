FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install

COPY . .

RUN npm run build


FROM node:20-alpine AS prod

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules


EXPOSE 3000

ENV PORT=3000
ENV ENVIRONMENT=production

CMD ["node", "dist/main"]
