'use strict';

/**
 * Función Lambda básica que devuelve un saludo
 */
exports.handler = async (event) => {
    console.log('Evento recibido:', JSON.stringify(event));

    // Obtener parámetros de la consulta si existen
    const queryParams = event.queryStringParameters || {};
    const name = queryParams.name || 'Usuario';

    // Preparar respuesta
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            message: `¡Hola ${name}! Bienvenido a AgroDigital API`,
            timestamp: new Date().toISOString()
        }),
    };

    return response;
}; 