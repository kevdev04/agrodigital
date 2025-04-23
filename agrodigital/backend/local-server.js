'use strict';

// Cargar variables de entorno primero
require('./utils/env').loadEnv();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importar manejadores de funciones
const register = require('./functions/auth/register');
const login = require('./functions/auth/login');
const profile = require('./functions/users/profile');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Funciones de utilidad
const wrapHandler = (handler) => async (req, res) => {
    try {
        // Convertir la solicitud de Express a evento de API Gateway
        const event = {
            body: JSON.stringify(req.body),
            headers: req.headers,
            queryStringParameters: req.query,
            pathParameters: req.params,
            requestContext: {
                authorizer: {
                    claims: req.user || {} // Para funciones autenticadas
                }
            }
        };

        // Llamar al manejador de serverless
        const result = await handler(event);

        // Devolver la respuesta
        res.status(result.statusCode)
            .set(result.headers || {})
            .send(JSON.parse(result.body));
    } catch (error) {
        console.error('Error in handler:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Middleware de autenticación simulada para pruebas
// SOLO PARA DESARROLLO - ESTO NO ES SEGURO PARA PRODUCCIÓN
const mockAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || token === 'undefined') {
        return res.status(401).json({ message: 'No autenticado' });
    }

    // Simular un usuario autenticado para pruebas
    // En producción, esto validaría el token JWT de Cognito
    req.user = {
        sub: 'test-user-id', // Mock user ID
        email: 'test@example.com'
    };

    next();
};

// Rutas
app.post('/auth/register', wrapHandler(register.handler));
app.post('/auth/login', wrapHandler(login.handler));
app.get('/users/profile', mockAuth, wrapHandler(profile.getProfile));
app.put('/users/profile', mockAuth, wrapHandler(profile.updateProfile));

// Ruta de salud para probar que el servidor está funcionando
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor local ejecutándose en http://localhost:${PORT}`);
    console.log('Para probar las APIs:');
    console.log('- Salud:     GET    http://localhost:${PORT}/health');
    console.log('- Registro:  POST   http://localhost:${PORT}/auth/register');
    console.log('- Login:     POST   http://localhost:${PORT}/auth/login');
    console.log('- Perfil:    GET    http://localhost:${PORT}/users/profile');
    console.log('- Actualizar: PUT   http://localhost:${PORT}/users/profile');
}); 