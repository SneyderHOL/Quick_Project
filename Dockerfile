FROM node:12.16.1

RUN apt update -y && \
  apt -y install emacs-nox

COPY ./package.json /home

RUN npm install && npm install -g nodemon \
  express-generator && npm install \
  semistandard --global


WORKDIR /home/

CMD ["/bin/bash"]
