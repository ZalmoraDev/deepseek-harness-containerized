FROM node:24-alpine
WORKDIR /home/node/app
COPY deepseek-harness/ /home/node/app
ENV CI=true

# 1 essential, 2 recommended
RUN apk add --no-cache \
    git pnpm socat su-exec nodejs-dev nano python3 py3-pip g++ \
    bash curl grep sed gawk ripgrep fd jq make cmake yt-dlp

RUN npm install -g node-gyp # Needed for plugin installation
RUN pnpm install
RUN pnpm run build
# Own the app tree as node at build time so there is no startup chown race:
# execs into the container right after `dsh start` run immediately as node.
RUN chown -R node:node /home/node
EXPOSE 3080

# Normalize 'Line Feed' CRLF -> LF so a Windows git checkout does notleave a trailing \r on the shebang
COPY entrypoint /entrypoint
RUN sed -i 's/\r$//' /entrypoint && chmod +x /entrypoint
ENTRYPOINT ["/entrypoint"]

# `--expose-internals --import tsx/esm` is a reported issue
# https://github.com/deepseek-ai/deepseek-harness/discussions/752
# Runs socat to proxy port 3080 on 0.0.0.0 to DSH's internal 127.0.0.1:3079
CMD socat TCP-LISTEN:3080,fork,reuseaddr TCP:127.0.0.1:3079 & \
    node --expose-internals --import tsx/esm apps/cli/src/bin.ts web --no-open --port 3079