# Microservicio de Inventario - Goldfish

Microservicio para la gestión de inventario usando Node.js, TypeScript y Express.

## Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL
- npm o yarn
- **ms-producto** debe estar ejecutándose

## Instalación

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Copiar archivo de entorno:
   ```bash
   cp .env.example .env
   ```

3. Configurar variables de entorno en `.env`:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=goldfish_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_SCHEMA=inventario

   # Product Service Configuration
   PRODUCT_SERVICE_URL=http://localhost:3000

   # Service-to-Service Authentication
   # Opción 1: Token pre-generado (recomendado para producción)
   PRODUCT_SERVICE_TOKEN=tu-token-jwt-del-servicio-producto

   # Opción 2: Auto-login (alternativa)
   # SERVICE_EMAIL=service@inventory.goldfish.com
   # SERVICE_PASSWORD=service-password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=24h
   ```

4. Crear el schema en PostgreSQL (si no existe):
   ```sql
   CREATE SCHEMA inventario;
   ```

5. Obtener token del servicio de productos (ms-producto debe estar ejecutándose):
   ```bash
   POST http://localhost:3000/api/auth/login
   Body: {
     "email": "admin@example.com",
     "password": "password"
   }
   ```
   Copiar el token recibido y agregarlo a `PRODUCT_SERVICE_TOKEN` en `.env`

## Ejecución

**Modo desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm run build
npm start
```

El servidor se ejecutará en `http://localhost:3001`

## Documentación API

Accede a la documentación Swagger en:
```
http://localhost:3001/api-docs
```

## Autenticación

Todos los endpoints de inventario requieren autenticación JWT.

1. Obtener token:
   ```bash
   POST http://localhost:3001/api/auth/login
   Body: {
     "email": "admin@example.com",
     "password": "password"
   }
   ```

2. Usar el token:
   ```bash
   GET http://localhost:3001/api/inventory/quantities
   Headers: {
     "Authorization": "Bearer <tu-token>"
   }
   ```

## Endpoints Principales

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/inventory/quantities` - Consultar cantidades de productos
- `GET /api/inventory/quantities?productId=uuid` - Consultar cantidad de un producto
- `POST /api/inventory` - Agregar producto al inventario
- `POST /api/inventory/buy` - Procesar compra y actualizar inventario
- `GET /api/inventory` - Listar items de inventario
- `GET /api/inventory/:id` - Obtener item por ID
- `PUT /api/inventory/:id` - Actualizar item
- `DELETE /api/inventory/:id` - Eliminar item
- `GET /health` - Estado del servicio

## Comunicación con ms-producto

Este microservicio se comunica con **ms-producto** para:
- Consultar información de productos
- Actualizar cantidades de inventario
- Validar existencia de productos

**Importante:** Asegúrate de que:
1. ms-producto esté ejecutándose
2. `PRODUCT_SERVICE_URL` apunte correctamente
3. `PRODUCT_SERVICE_TOKEN` contenga un token válido

## Estructura del Proyecto

```
src/
├── app.ts              # Aplicación principal
├── config/             # Configuración (database, swagger, passport)
├── controllers/        # Controladores
├── middleware/         # Middleware (auth, errorHandler)
├── routes/             # Rutas
├── useCases/           # Casos de uso
└── utils/              # Utilidades (productServiceClient)
```

## Licencia

ISC
