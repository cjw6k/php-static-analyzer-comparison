FROM alpine:3.20.3@sha256:beefdbd8a1da6d2915566fde36db9db0b524eb737fc57cd1367effd16dc0d06d

ARG PHP_VERSION="8.3.12-r0"

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
