FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS prod

WORKDIR /usr/src/app

# Instala Chromium e libs necessárias
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    fontconfig \
    udev \
    bash

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/public ./public

EXPOSE 3000

CMD ["node", "dist/main"]

