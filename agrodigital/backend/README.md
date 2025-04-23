# AgroDigital Backend

Backend para la aplicación AgroDigital, usando Serverless Framework, AWS Lambda, API Gateway y DynamoDB.

## Requisitos previos

- Node.js (versión 18 o superior)
- Docker (para DynamoDB local)
- AWS CLI (para despliegue en AWS)

## Configuración del entorno local

1. Instalar dependencias:

```bash
npm install
```

2. Iniciar DynamoDB local con Docker:

```bash
docker-compose up -d
```

3. Crear tablas en DynamoDB local:

```bash
node scripts/create-tables.js create
```

4. Cargar datos de ejemplo:

```bash
node scripts/load-data.js
```

5. Iniciar el servidor local:

```bash
npm run start
```

El servidor estará disponible en http://localhost:3000

## APIs disponibles

### Autenticación
- POST /auth/register - Registrar usuario
- POST /auth/login - Iniciar sesión

### Usuarios
- GET /users/profile - Obtener perfil de usuario
- PUT /users/profile - Actualizar perfil de usuario

### API Hello (ejemplo)
- GET /hello - Endpoint básico de prueba

### Cultivos
- POST /crops - Crear cultivo
- GET /crops/{cropId} - Obtener cultivo por ID
- GET /users/{userId}/crops - Obtener cultivos por usuario
- PUT /crops/{cropId} - Actualizar cultivo
- DELETE /crops/{cropId} - Eliminar cultivo
- GET /crops/type/{cropType} - Obtener cultivos por tipo

## Despliegue en AWS

Para desplegar en AWS:

```bash
npm run deploy
```

## Limpieza

Para detener DynamoDB local:

```bash
docker-compose down
```

Para eliminar las tablas:

```bash
node scripts/create-tables.js delete
``` 