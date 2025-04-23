# API Gateway con Lambda básica

Esta es una función Lambda básica configurada con API Gateway que devuelve un saludo.

## Endpoints

### GET /hello

Endpoint que devuelve un saludo básico.

**Parámetros de consulta:**
- `name` (opcional): Nombre del usuario a saludar. Si no se proporciona, se usará "Usuario".

**Respuesta:**
```json
{
  "message": "¡Hola [nombre]! Bienvenido a AgroDigital API",
  "timestamp": "2023-05-12T12:34:56.789Z"
}
```

## Pruebas locales

Para probar la API localmente, ejecuta:

```bash
cd agrodigital/backend
npm install              # Solo la primera vez
serverless offline start
```

Luego visita o utiliza curl:
```bash
curl http://localhost:3000/dev/hello?name=Juan
```

## Despliegue

Para desplegar en AWS:

```bash
cd agrodigital/backend
serverless deploy
```

Una vez desplegado, podrás acceder a la API usando la URL que te proporciona AWS API Gateway. 