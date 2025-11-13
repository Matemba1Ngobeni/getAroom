# ---------- Stage 1: Build the React app ----------
FROM node:25.2.0-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# ---------- Stage 2: Serve the built app ----------
FROM node:25.2.0-alpine

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

RUN npm install express

COPY server.js .

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
