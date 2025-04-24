# AgroDigital Authentication

Este proyecto utiliza AWS Amplify Auth Gen 2 para la autenticación.

## Configuración

Para configurar Amplify Auth en tu entorno:

1. Actualiza el archivo `amplify.js` con tus propias credenciales de AWS Cognito:

```js
// amplify.js
import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'TU_USER_POOL_ID',
        userPoolClientId: 'TU_USER_POOL_CLIENT_ID',
        region: 'TU_REGION',
      }
    }
  });
};
```

2. Este archivo se inicializa automáticamente en `_layout.tsx`

## Flujos de autenticación implementados

### Inicio de sesión
- Autenticación con email/password
- Manejo de confirmación MFA mediante SMS
- Funcionalidad de olvidé mi contraseña
- Manejo de cambio forzado de contraseña

### Registro
- Registro de usuarios con email/password
- Recopilación de datos adicionales de usuario
- Confirmación mediante código de verificación
- Flujo para reenvío de códigos

### Verificación
- Pantalla unificada para códigos de verificación
- Maneja tanto confirmación de registro como MFA
- Interfaz intuitiva con campos de entrada individuales
- Timer para reenvío de códigos

## Archivos principales

- `amplify.js` - Configuración central de Amplify
- `IniciarSesionScreen.tsx` - Pantalla de inicio de sesión
- `RegistroUsuarioScreen.tsx` - Registro de nuevos usuarios
- `VerificacionSMSScreen.tsx` - Verificación de códigos SMS
- `ResetPasswordScreen.tsx` - Restablecimiento de contraseña
- `CambiarContrasenaScreen.tsx` - Cambio de contraseña obligatorio

## Requisitos de seguridad

- Las contraseñas deben tener al menos 8 caracteres
- Se valida el formato de email
- Todos los flujos de error están manejados apropiadamente
- Las interfaces incluyen estados de carga para operaciones asíncronas
