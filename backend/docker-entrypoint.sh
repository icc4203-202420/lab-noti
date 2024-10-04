#!/bin/bash
# docker-entrypoint.sh
set -e

# Eliminar el archivo server.pid existente
rm -f /app/tmp/pids/server.pid

# Ejecutar el comando pasado al docker run, etc.
exec "$@"