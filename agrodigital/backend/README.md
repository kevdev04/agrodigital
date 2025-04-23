# Backend de AgroDigital

Este es el backend de la aplicación AgroDigital, basado en AWS Lambda, API Gateway, DynamoDB y Cognito.

## Requisitos previos

- Node.js (v14+)
- AWS CLI configurado
- Una cuenta AWS
- Serverless Framework (`npm install -g serverless`)

## Configuración inicial

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   - Copia el archivo `.env.example` a `.env`
   - Actualiza los valores de las variables de entorno con tus credenciales de AWS

3. **Crear un User Pool en AWS Cognito**:
   - Ve a la consola de AWS
   - Navega a Amazon Cognito
   - Crea un nuevo User Pool
   - Configura los atributos estándar (email, name)
   - Crea un App Client
   - Copia el User Pool ID y el App Client ID a tu archivo `.env`

## Desarrollo local

### Opción 1: Usando Express (recomendado para pruebas rápidas)

```bash
npm run dev
```

Esto iniciará un servidor Express que simula API Gateway y AWS Lambda en `http://localhost:3000`.

### Opción 2: Usando Serverless Offline

```bash
npm start
```

Esto iniciará Serverless Offline que emula AWS Lambda y API Gateway en `http://localhost:3000`.

## Despliegue en AWS

Para desplegar a AWS:

```bash
# Despliegue en el entorno predeterminado (dev)
npm run deploy

# Despliegue en entorno específico
npm run deploy:dev
npm run deploy:prod
```

## Estructura de directorios

```
backend/
├── functions/           # Funciones Lambda
│   ├── auth/            # Autenticación
│   └── users/           # Gestión de usuarios
├── utils/               # Utilidades compartidas
├── models/              # Modelos de datos
├── .env                 # Variables de entorno (local)
├── .env.example         # Ejemplo de variables de entorno
├── local-server.js      # Servidor Express para desarrollo local
└── serverless.yml       # Configuración de Serverless Framework
```

## APIs disponibles

### Autenticación

- **Registro**: `POST /auth/register`
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "Contraseña123!",
    "name": "Nombre Usuario",
    "phoneNumber": "+1234567890"
  }
  ```

- **Login**: `POST /auth/login`
  ```json
  {
    "email": "usuario@ejemplo.com",
    "password": "Contraseña123!"
  }
  ```

### Perfil de usuario

- **Obtener perfil**: `GET /users/profile`
  - Headers: `Authorization: Bearer {token}`

- **Actualizar perfil**: `PUT /users/profile`
  - Headers: `Authorization: Bearer {token}`
  ```json
  {
    "name": "Nuevo Nombre",
    "phoneNumber": "+0987654321"
  }
  ```

## Pruebas

### Con Postman

1. Inicia el servidor local (`npm run dev`)
2. Importa la colección de Postman (disponible en `/docs/postman-collection.json`)
3. Prueba los endpoints

### Con curl

```bash
# Verificar que el servidor esté funcionando
curl http://localhost:3000/health

# Registrar un usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!", "name": "Test User"}'

# Iniciar sesión
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!"}'

# Obtener el perfil (reemplaza {token} con el token obtenido en el login)
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer {token}"
``` 