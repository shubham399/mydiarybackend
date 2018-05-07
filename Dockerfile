FROM ubuntu:16.04

ENV DEBIAN_FRONTEND      noninteractive
ENV DEPLOY_MODE          test
ENV NODE_ENV             test
ENV NVM_DIR              /usr/local/nvm
ENV NODE_VERSION         8.5.0
ENV PORT                 8000

RUN usermod -u 1000 www-data
RUN usermod -G staff www-data
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN export DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_FRONTEND noninteractive
RUN dpkg-divert --local --rename --add /sbin/initctl

RUN apt-get -y update
RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
RUN apt-get -y install ca-certificates rpl pwgen git curl wget lsb-release

# Install postgres / postgis
RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get -y install postgresql-9.5-postgis-2.2
RUN apt-get install -y --no-install-recommends postgis

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update && apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        python \
        rsync \
        software-properties-common \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN echo "postgres:docker" | chpasswd && adduser postgres sudo
RUN echo "local   all             all                                     trust" > /etc/postgresql/9.5/main/pg_hba.conf
RUN echo "host    all             all             127.0.0.1/32            trust" >> /etc/postgresql/9.5/main/pg_hba.conf
RUN echo "host    all             all             ::1/128                 trust" >> /etc/postgresql/9.5/main/pg_hba.conf
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER postgres

ENV DATABASE_URL    postgres://postgres@localhost/test-database

RUN service postgresql start &&\
    createdb -O postgres test-database &&\
    psql $DATABASE_URL -c 'CREATE EXTENSION postgis; CREATE EXTENSION postgis_topology; CREATE EXTENSION fuzzystrmatch; CREATE EXTENSION postgis_tiger_geocoder;' 1>/dev/null &&\
    service postgresql stop

USER root

# Install redis
RUN add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) main universe"
RUN apt-get update
RUN apt-get install -y redis-server
ENV REDIS_URL       redis://:@localhost:6379

## NODEJS
RUN apt-get -y install build-essential

# Exclude the NPM cache from the image
VOLUME /root/.npm

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

# Install nvm with node and npm, then migrate the local database
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH            $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH                 $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
ENV DEBIAN_FRONTEND      ""

#Install dependencies
COPY package*.json ./
RUN npm i
COPY . .
ENV JWT_KEY=secret
ENV COMMON_SALT=13b7654d-fd16-488b-9e25-2113f478ccbf

# Open port 5432 for postgres, 8000 for the app
EXPOSE 5432
EXPOSE 6379
EXPOSE 8000

# Default command. Runs tests
CMD bash -c "service postgresql start && service redis-server start && npm start"
