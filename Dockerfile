FROM alpine:3.19.1@sha256:c5b1261d6d3e43071626931fc004f70149baeba2c8ec672bd4f27761f8e1ad6b

ARG PHP_VERSION="8.3.7-r0"

RUN apk add --no-cache \
    php83=${PHP_VERSION} \
    php83-curl=${PHP_VERSION} \
    php83-dom=${PHP_VERSION} \
    php83-mbstring=${PHP_VERSION} \
    php83-openssl=${PHP_VERSION} \
    php83-pecl-ast=1.1.1-r0 \
    php83-phar=${PHP_VERSION} \
    php83-simplexml=${PHP_VERSION} \
    php83-tokenizer=${PHP_VERSION} \
 && ln -s /usr/bin/php83 /usr/bin/php

COPY --from=composer:2.6.5 /usr/bin/composer /usr/bin/composer

WORKDIR /opt/php-static-analyzer-comparison

COPY ./composer.json .
COPY ./composer.lock .
RUN composer install --no-dev --no-cache --no-interaction --no-scripts --no-autoloader

COPY ./vendor-bin ./vendor-bin
RUN composer install --no-dev --no-cache --no-interaction --no-scripts

COPY . .
RUN composer dump-autoload --optimize
