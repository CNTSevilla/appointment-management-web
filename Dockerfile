FROM node:lts-slim AS build

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]
