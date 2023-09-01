FROM alpine:3.18.3@sha256:7144f7bab3d4c2648d7e59409f15ec52a18006a128c733fcff20d3a4a54ba44a

ARG PHP_VERSION="8.2.10-r0"

RUN apk add --no-cache \
    php82=${PHP_VERSION} \
    php82-curl=${PHP_VERSION} \
    php82-dom=${PHP_VERSION} \
    php82-mbstring=${PHP_VERSION} \
    php82-openssl=${PHP_VERSION} \
    php82-pecl-ast=1.1.0-r1 \
    php82-phar=${PHP_VERSION} \
    php82-simplexml=${PHP_VERSION} \
    php82-tokenizer=${PHP_VERSION} \
 && ln -s /usr/bin/php82 /usr/bin/php

COPY --from=composer:2.5.8 /usr/bin/composer /usr/bin/composer

WORKDIR /opt/php-static-analyzer-comparison

COPY ./composer.json .
COPY ./composer.lock .
RUN composer install --no-dev --no-cache --no-interaction --no-scripts --no-autoloader

COPY ./vendor-bin ./vendor-bin
RUN composer install --no-dev --no-cache --no-interaction --no-scripts

COPY . .
RUN composer dump-autoload --optimize
