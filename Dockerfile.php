FROM php:8.2-apache

# Install required PHP extensions for MySQL and Composer + Python for ML
RUN apt-get update && apt-get install -y \
    unzip \
    git \
    libzip-dev \
    python3 \
    && docker-php-ext-install pdo pdo_mysql zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Copy Composer from the official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Set ServerName to suppress warnings
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Give Apache permissions
RUN chown -R www-data:www-data /var/www/html

# Expose port 80
EXPOSE 80
