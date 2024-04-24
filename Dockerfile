# FROM node:lts-alpine@sha256:19eaf41f3b8c2ac2f609ac8103f9246a6a6d46716cdbe49103fdb116e55ff0cc
FROM node:lts-alpine@sha256:98218110d09c63b72376137860d1f30a4f61ce029d7de4caf2e8c00f3bcf0db7

USER root

RUN apk update && apk upgrade --no-cache && \
    apk add postgresql

# Setup nodejs group & nodejs user
RUN addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

USER 999

WORKDIR /app

COPY --chown=999:998 . /app

RUN yarn install --frozen-lockfile --production --ignore-optional && \
    yarn run postinstall

HEALTHCHECK --interval=5m --timeout=3s \
 CMD curl --fail http://localhost:8080 || exit 1

CMD ["sh", "/app/run.sh"]

EXPOSE 8080
