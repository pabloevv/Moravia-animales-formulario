FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY client/package*.json ./client/
RUN npm ci --prefix client

COPY server/package*.json ./server/
RUN npm ci --prefix server

COPY client ./client
RUN npm run build --prefix client

COPY server ./server
RUN npm run build --prefix server

FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV CLIENT_DIST_DIR=/app/client/dist
WORKDIR /app

COPY server/package*.json ./server/
RUN npm ci --omit=dev --prefix server && npm cache clean --force

COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/dist ./client/dist

EXPOSE 3001
CMD ["node", "server/dist/server.js"]
