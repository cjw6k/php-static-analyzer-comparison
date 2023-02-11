FROM alpine:edge@sha256:4f83fc905e4551f4e07de298f55745e766cc880f890244c1e6872aab60f0a0f6

RUN apk add --no-cache \
    php82=8.2.2-r0 \
    php82-curl=8.2.2-r0 \
    php82-dom=8.2.2-r0 \
    php82-mbstring=8.2.2-r0 \
    php82-openssl=8.2.2-r0 \
    php82-phar=8.2.2-r0 \
    php82-simplexml=8.2.2-r0 \
    php82-tokenizer=8.2.2-r0 \
 && ln -s /usr/bin/php82 /usr/bin/php

COPY --from=composer:2.5.3 /usr/bin/composer /usr/bin/composer

WORKDIR /opt/php-static-analyzer-comparison

COPY ./composer.json .
COPY ./composer.lock .
RUN composer install --no-dev --no-cache --no-interaction --no-scripts --no-autoloader

COPY ./vendor-bin ./vendor-bin
RUN composer install --no-dev --no-cache --no-interaction --no-scripts

COPY . .
RUN composer dump-autoload --optimize
