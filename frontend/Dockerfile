# Usar una imagen base de Node.js con la versión específica
FROM node:22.6.0

# Crear el directorio para la aplicación
WORKDIR /app

# Instalar dependencias del sistema necesarias para Expo
RUN apt-get update -qq && apt-get install -y \
    git \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Instalar Expo CLI globalmente
RUN npm install -g expo-cli

# Copiar el package.json y package-lock.json (o yarn.lock si usas Yarn)
COPY /frontend/package.json /frontend/package-lock.json* ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código de la aplicación
COPY frontend .

# Exponer los puertos necesarios
EXPOSE 19000 19001 19002 8081

# Establecer el comando por defecto para iniciar Expo
# CMD ["npx", "expo", "start", "--tunnel", "--non-interactive"]