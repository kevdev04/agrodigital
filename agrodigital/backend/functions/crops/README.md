# API de Gestión de Cultivos

Este módulo proporciona una API completa para gestionar cultivos agrícolas en AgroDigital.

## Endpoints

### 1. Crear un cultivo

**URL:** `/crops`  
**Método:** `POST`  
**Autenticación:** Requerida  

**Cuerpo de la solicitud:**
```json
{
  "userId": "user123",
  "name": "Maíz Amarillo",
  "cropType": "Maíz",
  "plantDate": "2023-04-15",
  "location": "Parcela Norte",
  "area": 5.2,
  "status": "active",
  "notes": "Variedad resistente a sequía"
}
```

**Campos requeridos:**
- `userId`: ID del usuario propietario del cultivo
- `name`: Nombre del cultivo
- `cropType`: Tipo de cultivo (ej: Maíz, Frijol, etc.)

**Respuesta exitosa:**
```json
{
  "cropId": "c8f7d8e9-f1a2-4b3c-9d7e-8f6a5b4c3d2e",
  "userId": "user123",
  "name": "Maíz Amarillo",
  "cropType": "Maíz",
  "plantDate": "2023-04-15",
  "location": "Parcela Norte",
  "area": 5.2,
  "status": "active",
  "notes": "Variedad resistente a sequía",
  "createdAt": "2023-05-12T15:30:45.123Z",
  "updatedAt": "2023-05-12T15:30:45.123Z"
}
```

### 2. Obtener un cultivo por ID

**URL:** `/crops/{cropId}`  
**Método:** `GET`  
**Autenticación:** Requerida  

**Respuesta exitosa:**
```json
{
  "cropId": "c8f7d8e9-f1a2-4b3c-9d7e-8f6a5b4c3d2e",
  "userId": "user123",
  "name": "Maíz Amarillo",
  "cropType": "Maíz",
  "plantDate": "2023-04-15",
  "location": "Parcela Norte",
  "area": 5.2,
  "status": "active",
  "notes": "Variedad resistente a sequía",
  "createdAt": "2023-05-12T15:30:45.123Z",
  "updatedAt": "2023-05-12T15:30:45.123Z"
}
```

### 3. Obtener cultivos por usuario

**URL:** `/users/{userId}/crops`  
**Método:** `GET`  
**Autenticación:** Requerida  

**Respuesta exitosa:**
```json
[
  {
    "cropId": "c8f7d8e9-f1a2-4b3c-9d7e-8f6a5b4c3d2e",
    "userId": "user123",
    "name": "Maíz Amarillo",
    "cropType": "Maíz",
    "plantDate": "2023-04-15",
    "location": "Parcela Norte",
    "area": 5.2,
    "status": "active",
    "notes": "Variedad resistente a sequía",
    "createdAt": "2023-05-12T15:30:45.123Z",
    "updatedAt": "2023-05-12T15:30:45.123Z"
  },
  {
    "cropId": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    "userId": "user123",
    "name": "Frijol Negro",
    "cropType": "Frijol",
    "plantDate": "2023-03-10",
    "location": "Parcela Sur",
    "area": 3.5,
    "status": "harvested",
    "notes": "Cultivo finalizado",
    "createdAt": "2023-03-05T10:15:30.456Z",
    "updatedAt": "2023-06-20T14:25:10.789Z"
  }
]
```

### 4. Actualizar un cultivo

**URL:** `/crops/{cropId}`  
**Método:** `PUT`  
**Autenticación:** Requerida  

**Cuerpo de la solicitud:**
```json
{
  "name": "Maíz Amarillo Premium",
  "status": "in_progress",
  "notes": "Aplicado fertilizante el 20/05/2023"
}
```

**Respuesta exitosa:**
```json
{
  "cropId": "c8f7d8e9-f1a2-4b3c-9d7e-8f6a5b4c3d2e",
  "userId": "user123",
  "name": "Maíz Amarillo Premium",
  "cropType": "Maíz",
  "plantDate": "2023-04-15",
  "location": "Parcela Norte",
  "area": 5.2,
  "status": "in_progress",
  "notes": "Aplicado fertilizante el 20/05/2023",
  "createdAt": "2023-05-12T15:30:45.123Z",
  "updatedAt": "2023-05-20T09:45:30.456Z"
}
```

### 5. Eliminar un cultivo

**URL:** `/crops/{cropId}`  
**Método:** `DELETE`  
**Autenticación:** Requerida  

**Respuesta exitosa:**
```json
{
  "message": "Cultivo eliminado correctamente"
}
```

### 6. Obtener cultivos por tipo

**URL:** `/crops/type/{cropType}`  
**Método:** `GET`  
**Autenticación:** Requerida  

**Respuesta exitosa:**
```json
[
  {
    "cropId": "c8f7d8e9-f1a2-4b3c-9d7e-8f6a5b4c3d2e",
    "userId": "user123",
    "name": "Maíz Amarillo",
    "cropType": "Maíz",
    "plantDate": "2023-04-15",
    "location": "Parcela Norte",
    "area": 5.2,
    "status": "active",
    "notes": "Variedad resistente a sequía",
    "createdAt": "2023-05-12T15:30:45.123Z",
    "updatedAt": "2023-05-12T15:30:45.123Z"
  },
  {
    "cropId": "q1w2e3r4-t5y6-u7i8-o9p0-a1s2d3f4g5h6",
    "userId": "user456",
    "name": "Maíz Blanco",
    "cropType": "Maíz",
    "plantDate": "2023-02-20",
    "location": "Parcela Este",
    "area": 4.0,
    "status": "active",
    "notes": "Cultivo experimental",
    "createdAt": "2023-02-15T11:20:35.789Z",
    "updatedAt": "2023-02-15T11:20:35.789Z"
  }
]
```

## Pruebas locales

Para probar las APIs localmente:

```bash
cd agrodigital/backend
npm run start
```

## Ejemplos de uso con curl

### Crear un cultivo
```bash
curl -X POST \
  http://localhost:3000/dev/crops \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "user123",
    "name": "Maíz Amarillo",
    "cropType": "Maíz",
    "plantDate": "2023-04-15",
    "location": "Parcela Norte",
    "area": 5.2
  }'
```

### Obtener cultivos de un usuario
```bash
curl -X GET http://localhost:3000/dev/users/user123/crops
```

## Códigos de error

- **400** - Solicitud inválida (datos faltantes o incorrectos)
- **404** - Recurso no encontrado
- **500** - Error del servidor 