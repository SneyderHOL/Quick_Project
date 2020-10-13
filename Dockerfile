FROM node:14.13.1-alpine3.10
# Setting working directory. All the path will be relative to WORKDIR
# keep this first to copy the package json
WORKDIR /app
ENV NPM_CONFIG_LOGLEVEL=warn
COPY ./package.json /app

RUN npm config set package-lock false
# and/or set it with a command-line option
RUN npm install --loglevel=warn --only=prod

COPY . /app

# CMD node index.js
EXPOSE 3000
