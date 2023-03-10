FROM alpine:edge@sha256:5bd9939b4140caa8c716499e53438053b4e1aa872a170f4399ec71c00e23b835

RUN apk add --no-cache \
    php82=8.2.3-r0 \
    php82-curl=8.2.3-r0 \
    php82-dom=8.2.3-r0 \
    php82-mbstring=8.2.3-r0 \
    php82-openssl=8.2.3-r0 \
    php82-pecl-ast=1.1.0-r1 \
    php82-phar=8.2.3-r0 \
    php82-simplexml=8.2.3-r0 \
    php82-tokenizer=8.2.3-r0 \
 && ln -s /usr/bin/php82 /usr/bin/php

COPY --from=composer:2.5.4 /usr/bin/composer /usr/bin/composer

WORKDIR /opt/php-static-analyzer-comparison

COPY ./composer.json .
COPY ./composer.lock .
RUN composer install --no-dev --no-cache --no-interaction --no-scripts --no-autoloader

COPY ./vendor-bin ./vendor-bin
RUN composer install --no-dev --no-cache --no-interaction --no-scripts

COPY . .
RUN composer dump-autoload --optimize
