FROM alpine:3.20.3@sha256:1e42bbe2508154c9126d48c2b8a75420c3544343bf86fd041fb7527e017a4b4a

ARG PHP_VERSION="8.3.13-r0"

RUN apk add --no-cache \
    php83=${PHP_VERSION} \
    php83-ctype=${PHP_VERSION} \
    php83-curl=${PHP_VERSION} \
    php83-dom=${PHP_VERSION} \
    php83-mbstring=${PHP_VERSION} \
    php83-openssl=${PHP_VERSION} \
    php83-pecl-ast=1.1.1-r0 \
    php83-phar=${PHP_VERSION} \
    php83-simplexml=${PHP_VERSION} \
    php83-tokenizer=${PHP_VERSION}

COPY --from=composer:2.7.7 /usr/bin/composer /usr/bin/composer

WORKDIR /opt/php-static-analyzer-comparison

COPY ./composer.json .
COPY ./composer.lock .
RUN composer install --no-dev --no-cache --no-interaction --no-scripts --no-autoloader

COPY ./vendor-bin ./vendor-bin
RUN composer install --no-dev --no-cache --no-interaction --no-scripts

COPY . .
RUN composer dump-autoload --optimize
