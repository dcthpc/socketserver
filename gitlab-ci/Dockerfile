FROM node:16.20.0-bullseye

RUN apt update \
  && apt install --fix-missing -y \
  supervisor \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# COPY package.json package-lock.json ./

COPY . .

RUN npm install

# set supervisord
COPY ./gitlab-ci/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN mkdir -p /app/log

EXPOSE 3000

CMD [ "/usr/bin/supervisord" ]

# CMD ["node", "server.js"]
