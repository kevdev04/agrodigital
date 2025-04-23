'use strict';

const AWS = require('aws-sdk');
// Forzar la región us-east-1
AWS.config.update({ region: 'us-east-1' });
const crypto = require('crypto');

const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const USER_POOL_ID = process.env.USER_POOL_ID;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID;
const USER_POOL_CLIENT_SECRET = process.env.USER_POOL_CLIENT_SECRET || '1e62gvpjrp5aq06v09d1m57lo2d5kvs9koi7uafg6uuoi8l3gdou'; // Usa una variable de entorno o configura el secreto aquí
const USER_TABLE = process.env.USER_TABLE;

// Función para calcular el SECRET_HASH
function calculateSecretHash(username) {
    const message = username + USER_POOL_CLIENT_ID;
    const hmac = crypto.createHmac('sha256', USER_POOL_CLIENT_SECRET);
    hmac.update(message);
    return hmac.digest('base64');
}

module.exports.handler = async (event) => {
    console.log('Iniciando función de login');
    console.log('USER_POOL_ID:', USER_POOL_ID);
    console.log('USER_POOL_CLIENT_ID:', USER_POOL_CLIENT_ID);
    console.log('USER_TABLE:', USER_TABLE);
    console.log('AWS Region:', AWS.config.region);

    try {
        const body = JSON.parse(event.body);
        const { email, password } = body;

        // Validar campos requeridos
        if (!email || !password) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: 'Campos requeridos: email, password'
                })
            };
        }

        // Usar el CLIENT_ID de las variables de entorno
        let CLIENT_ID = USER_POOL_CLIENT_ID;

        // Si no hay CLIENT_ID en las variables de entorno, intentar obtenerlo
        if (!CLIENT_ID) {
            // Buscar el cliente ID del user pool
            const clientParams = {
                UserPoolId: USER_POOL_ID,
                MaxResults: 1
            };

            const clientList = await cognito.listUserPoolClients(clientParams).promise();
            CLIENT_ID = clientList.UserPoolClients[0].ClientId;
        }

        console.log('Usando CLIENT_ID:', CLIENT_ID);

        // Calcular el SECRET_HASH
        const secretHash = calculateSecretHash(email);
        console.log('SECRET_HASH calculado para:', email);

        // Iniciar sesión con Cognito usando el email como alias
        const authParams = {
            AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
            ClientId: CLIENT_ID,
            UserPoolId: USER_POOL_ID,
            AuthParameters: {
                USERNAME: email,  // Cognito manejará el email como alias
                PASSWORD: password,
                SECRET_HASH: secretHash
            }
        };

        console.log('Intentando autenticar usuario:', JSON.stringify({ email, UserPoolId: USER_POOL_ID }));

        const authResponse = await cognito.adminInitiateAuth(authParams).promise();
        console.log('Autenticación exitosa');

        // Extraer el sub (userId) del token
        const tokenParts = authResponse.AuthenticationResult.IdToken.split('.');
        const tokenPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        const userId = tokenPayload.sub;

        console.log('Usuario autenticado con ID:', userId);

        // Obtener datos del usuario de DynamoDB
        const queryParams = {
            TableName: USER_TABLE,
            IndexName: 'email-index',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };

        console.log('Buscando usuario en DynamoDB:', JSON.stringify(queryParams));

        const queryResult = await dynamodb.query(queryParams).promise();
        const userData = queryResult.Items[0] || {};

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                message: 'Inicio de sesión exitoso',
                token: authResponse.AuthenticationResult.IdToken,
                refreshToken: authResponse.AuthenticationResult.RefreshToken,
                expiresIn: authResponse.AuthenticationResult.ExpiresIn,
                user: {
                    userId: userData.userId || userId,
                    email: userData.email || email,
                    name: userData.name,
                    phoneNumber: userData.phoneNumber
                }
            })
        };
    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        // Manejar errores específicos
        if (
            error.code === 'NotAuthorizedException' ||
            error.code === 'UserNotFoundException'
        ) {
            return {
                statusCode: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: 'Credenciales inválidas'
                })
            };
        }

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                message: 'Error al iniciar sesión',
                error: error.message,
                stack: process.env.STAGE === 'dev' ? error.stack : undefined
            })
        };
    }
};
