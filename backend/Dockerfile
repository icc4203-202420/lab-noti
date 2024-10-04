# # # Specify Ruby version
# # ARG RUBY_VERSION=3.2.3
# # FROM ruby:$RUBY_VERSION-slim as base

# # # Install dependencies
# # RUN apt-get update -qq && apt-get install -y \
# #     nodejs \
# #     postgresql-client \
# #     libvips \
# #     build-essential \
# #     libffi-dev \
# #     libssl-dev \
# #     pkg-config \
# #     git \
# #     curl \
# #     libmagickwand-dev \
# #     imagemagick

# # WORKDIR /app

# # # Install gems
# # COPY Gemfile Gemfile.lock ./
# # RUN gem install bundler && bundle install --without development test

# # # Copy the application code
# # COPY . .

# # # Precompile assets
# # RUN RAILS_ENV=production rails assets:precompile

# # EXPOSE 3000

# # COPY ./docker-entrypoint.sh /usr/local/bin/
# # RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# # ENTRYPOINT ["docker-entrypoint.sh"]
# # CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]


# # Use Ruby image based on version specified
# ARG RUBY_VERSION=3.3.4
# FROM ruby:$RUBY_VERSION

# # Set up environment variables
# ENV RAILS_ENV=development \
#     BUNDLE_PATH=/usr/local/bundle \
#     GEM_HOME=/usr/local/bundle \
#     BUNDLE_BIN=/usr/local/bundle/bin \
#     PATH=/app/bin:$BUNDLE_BIN:$PATH

# # Create a directory for the app code
# WORKDIR /app


# RUN apt-get update -qq && apt-get install -y \
#     libsqlite3-dev \
#     libvips-dev \
#     nodejs \
#     postgresql-client \
#     libvips \
#     build-essential \
#     libffi-dev \
#     libssl-dev \
#     pkg-config \
#     git \
#     curl \
#     libmagickwand-dev \
#     imagemagick

# # Copy Gemfile and Gemfile.lock
# COPY backend/Gemfile backend/Gemfile.lock ./

# # Install gems
# RUN bundle install

# # Copy the main application
# COPY backend .

# # Expose port 3000 to be accessible from the host
# EXPOSE 3000

# COPY /backend/docker-entrypoint.sh /usr/local/bin/
# RUN chmod +x /usr/local/bin/docker-entrypoint.sh
# ENTRYPOINT ["docker-entrypoint.sh"]
# # CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]
# Usar la imagen base de Ruby especificada
# Usar la imagen base de Ruby especificada
ARG RUBY_VERSION=3.3.4
FROM ruby:$RUBY_VERSION

# Establecer las variables de entorno necesarias para Rails y Bundler
ENV RAILS_ENV=development \
    BUNDLE_PATH=/usr/local/bundle \
    GEM_HOME=/usr/local/bundle \
    BUNDLE_BIN=/usr/local/bundle/bin \
    PATH=/app/bin:$BUNDLE_BIN:$PATH

# Crear el directorio para el código de la app
WORKDIR /app

# Instalar las dependencias del sistema necesarias para Rails y su funcionamiento
RUN apt-get update -qq && apt-get install -y \
    libsqlite3-dev \
    libvips-dev \
    nodejs \
    libvips \
    build-essential \
    libffi-dev \
    libssl-dev \
    pkg-config \
    git \
    curl \
    libmagickwand-dev \
    imagemagick \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

# Copiar el Gemfile y Gemfile.lock
COPY backend/Gemfile backend/Gemfile.lock ./

# Instalar la versión correcta de Bundler
RUN gem install bundler -v '~> 2.5'

# Instalar las gemas especificadas en el Gemfile
RUN bundle install

# Copiar el resto de la aplicación
COPY backend .

# Exponer el puerto 3000 para Rails
EXPOSE 3000

# Copiar el script de entrada (entrypoint) y hacer que sea ejecutable
COPY /backend/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Establecer el punto de entrada para el contenedor
ENTRYPOINT ["docker-entrypoint.sh"]

# Definir el comando predeterminado para iniciar el servidor de Rails
# CMD ["rails", "server", "-b", "0.0.0.0", "-p", "3000"]
