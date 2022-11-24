FROM node:16-alpine as base
WORKDIR /app
COPY ./package*.json ./
RUN npm i --ignore-scripts

FROM base as base_dev
COPY ./libs ./libs
COPY ./tools ./tools
COPY *.json ./
COPY *.js ./

FROM base as base_prod
COPY ./libs ./libs
COPY ./tools ./tools
COPY *.json ./

FROM base_dev AS api_dev
COPY ./apps/api ./apps/api
RUN node ./tools/docker/replaceWorkspace.js api
CMD ["./node_modules/.bin/nx", "run", "api:serve"]

FROM base_prod as api_prod
COPY ./apps/api ./apps/api
RUN node ./tools/docker/replaceWorkspace.js api && \
  ./node_modules/.bin/nx run api:build:production
CMD ["node", "./dist/apps/api/main"]
