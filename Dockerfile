FROM node:18.13 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM node:lts-bullseye-slim AS prod

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /app/build /app/build

CMD ["npm", "start"]