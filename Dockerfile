FROM oven/bun:slim AS bun-bin
WORKDIR /app
COPY package.json .
COPY bun.lockb .
RUN bun install --frozen-lockfile --production
RUN bun build node_modules/y-websocket/bin/server.js --minify --compile

FROM golang:1.21 AS hivemind-bin
RUN go install github.com/DarthSim/hivemind@latest

FROM caddy:latest AS caddy-bin

FROM debian:bookworm-slim
WORKDIR /app

COPY --from=hivemind-bin /go/bin/hivemind /usr/bin/
COPY --from=caddy-bin /usr/bin/caddy /usr/bin/

COPY --from=bun-bin /app/server .

COPY ./dist ./dist

COPY docker/server.sh .
COPY docker/Procfile .
COPY docker/Caddyfile .

EXPOSE 8080
CMD ["hivemind"]
