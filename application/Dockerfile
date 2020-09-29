FROM node:12.16.1

RUN apt update -y && \
    apt -y install emacs-nox

RUN npm install -g express-generator && \
    npm install semistandard --global

WORKDIR /home/

COPY ./package*.json .

RUN npm install

EXPOSE 3000
