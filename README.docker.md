# Docker Setup - Goldfish Microservices

Guía para ejecutar los microservicios usando Docker y Docker Compose.

## Requisitos Previos

- Docker (v20.10 o superior)
- Docker Compose (v2.0 o superior)

## Configuración Rápida

1. **Configurar variables de entorno:**
   ```bash
   cp docker-compose.env.example .env
   ```
   
   Edita el archivo `.env` y configura:
   - `JWT_SECRET`: Clave secreta para JWT (mínimo 32 caracteres)
   - `PRODUCT_SERVICE_TOKEN`: Token JWT para comunicación entre servicios (opcional, se puede obtener después)

2. **Construir y ejecutar todos los servicios:**
   ```bash
   docker-compose up -d
   ```

3. **Ver logs:**
   ```bash
   # Todos los servicios
   docker-compose logs -f
   
   # Servicio específico
   docker-compose logs -f ms-producto
   docker-compose logs -f ms-inventory
   ```

## Servicios

- **PostgreSQL**: `localhost:5432`
- **ms-producto**: `http://localhost:3000`
- **ms-inventory**: `http://localhost:3001`

## Obtener Token para Comunicación entre Servicios

Después de que los servicios estén ejecutándose:

1. Obtén un token de ms-producto:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password"}'
   ```

2. Actualiza el `.env` con el token:
   ```env
   PRODUCT_SERVICE_TOKEN=tu-token-aqui
   ```

3. Reinicia ms-inventory:
   ```bash
   docker-compose restart ms-inventory
   ```

## Comandos Útiles

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡cuidado! elimina datos)
docker-compose down -v

# Reconstruir imágenes
docker-compose build --no-cache

# Ver estado de los servicios
docker-compose ps

# Ejecutar comando en un contenedor
docker-compose exec ms-producto sh
docker-compose exec postgres psql -U postgres -d goldfish_db

# Ver logs de un servicio específico
docker-compose logs -f ms-producto
```

## Desarrollo con Docker

Para desarrollo, puedes usar volúmenes para hot-reload:

```yaml
# Agregar a docker-compose.yml en modo desarrollo
volumes:
  - ./ms-producto/src:/app/src
  - ./ms-producto/package.json:/app/package.json
```

## Producción

Para producción:

1. Usa variables de entorno seguras
2. Configura `JWT_SECRET` con una clave fuerte
3. Usa un reverse proxy (nginx) para HTTPS
4. Configura backups de la base de datos
5. Monitorea los logs y health checks

## Troubleshooting

### Los servicios no se conectan a la base de datos
- Verifica que PostgreSQL esté saludable: `docker-compose ps`
- Revisa los logs: `docker-compose logs postgres`

### ms-inventory no puede comunicarse con ms-producto
- Verifica que ms-producto esté saludable
- Asegúrate de que `PRODUCT_SERVICE_URL` apunte a `http://ms-producto:3000` (nombre del servicio en Docker)
- Verifica el token en `PRODUCT_SERVICE_TOKEN`

### Error de permisos
- Asegúrate de que los archivos tengan los permisos correctos
- Los contenedores corren como usuario no-root por seguridad

