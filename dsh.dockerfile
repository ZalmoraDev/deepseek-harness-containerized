FROM node:24-alpine
WORKDIR /app
COPY . .

ENV CI=true
# 1 essential, 2 recommended
RUN apk add --no-cache \
    git pnpm socat nodejs-dev nano g++ \
    bash curl grep sed gawk ripgrep fd jq python3 make cmake

RUN npm install -g node-gyp # Needed for plugin installation
RUN pnpm install
RUN pnpm run build
EXPOSE 3080

# `--expose-internals --import tsx/esm` is a reported issue
# https://github.com/deepseek-ai/deepseek-harness/discussions/752
# Runs socat to proxy port 3080 on 0.0.0.0 to DSH's internal 127.0.0.1:3079
CMD socat TCP-LISTEN:3080,fork,reuseaddr TCP:127.0.0.1:3079 & \
    node --expose-internals --import tsx/esm apps/cli/src/bin.ts web --no-open --port 3079