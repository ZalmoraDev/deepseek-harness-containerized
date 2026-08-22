FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache pnpm git

COPY . .

ENV CI=true

RUN pnpm install
RUN pnpm run build

EXPOSE 3080

# `--expose-internals --import tsx/esm` is a reported issue
CMD ["node", "--expose-internals", "--import", "tsx/esm", "apps/cli/src/bin.ts", "web", "--no-open"]
