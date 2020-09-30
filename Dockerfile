FROM node:12.16.1

RUN apt update -y && \
  apt -y install emacs-nox

COPY ./package.json /home

RUN npm install -g express-generator && \
  npm install semistandard --global

RUN npm install


WORKDIR /home/

EXPOSE 3000
