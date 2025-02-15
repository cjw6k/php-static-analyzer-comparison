FROM alpine:3.21.3@sha256:a8560b36e8b8210634f77d9f7f9efd7ffa463e380b75e2e74aff4511df3ef88c

ARG PHP_VERSION="8.3.16-r0"
ARG PHP_AST_VERSION=1.1.2-r0

RUN apk add --no-cache \
    php83=${PHP_VERSION} \
    php83-ctype=${PHP_VERSION} \
    php83-curl=${PHP_VERSION} \
    php83-dom=${PHP_VERSION} \
    php83-mbstring=${PHP_VERSION} \
    php83-openssl=${PHP_VERSION} \
    php83-pecl-ast=${PHP_AST_VERSION} \
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
