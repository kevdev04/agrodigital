'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configuración de AWS SDK para uso en Lambda
// Forzar la región us-east-1
AWS.config.update({ region: 'us-east-1' });

const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const USER_POOL_ID = process.env.USER_POOL_ID;
const USER_TABLE = process.env.USER_TABLE;

module.exports.handler = async (event) => {
    console.log('Iniciando función de registro');
    console.log('USER_POOL_ID:', USER_POOL_ID);
    console.log('USER_TABLE:', USER_TABLE);
    console.log('AWS Region:', AWS.config.region);
    console.log('Event:', JSON.stringify(event));

    try {
        const body = JSON.parse(event.body);
        console.log('Body parsed:', JSON.stringify(body));

        const { email, password, name, phoneNumber } = body;

        // Validar campos requeridos
        if (!email || !password || !name) {
            console.log('Campos requeridos faltantes');
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: 'Campos requeridos: email, password, name'
                })
            };
        }

        // Generar un nombre de usuario único
        const username = uuidv4();

        // Crear usuario en Cognito
        const cognitoParams = {
            UserPoolId: USER_POOL_ID,
            Username: username, // Usar UUID en lugar de email
            TemporaryPassword: password,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'name',
                    Value: name
                },
                {
                    Name: 'email_verified',
                    Value: 'true'
                }
            ]
        };

        if (phoneNumber) {
            cognitoParams.UserAttributes.push({
                Name: 'phone_number',
                Value: phoneNumber
            });
        }

        console.log('Intentando crear usuario en Cognito:', JSON.stringify(cognitoParams, null, 2));

        try {
            const cognitoResponse = await cognito.adminCreateUser(cognitoParams).promise();
            console.log('Usuario creado en Cognito:', JSON.stringify(cognitoResponse));

            const userId = cognitoResponse.User.Username;

            // Configurar contraseña permanente para evitar cambio en primer login
            try {
                await cognito.adminSetUserPassword({
                    UserPoolId: USER_POOL_ID,
                    Username: userId,
                    Password: password,
                    Permanent: true
                }).promise();
                console.log('Contraseña permanente configurada');
            } catch (passwordError) {
                console.error('Error al configurar contraseña permanente:', passwordError);
                // Continuamos a pesar del error, ya que el usuario fue creado
            }

            // Almacenar datos adicionales en DynamoDB
            const dynamoParams = {
                TableName: USER_TABLE,
                Item: {
                    userId,
                    email,
                    name,
                    phoneNumber: phoneNumber || null,
                    createdAt: new Date().toISOString(),
                    status: 'ACTIVE'
                }
            };

            console.log('Intentando guardar usuario en DynamoDB:', JSON.stringify(dynamoParams));

            try {
                await dynamodb.put(dynamoParams).promise();
                console.log('Usuario guardado en DynamoDB');
            } catch (dbError) {
                console.error('Error al guardar en DynamoDB:', dbError);

                // Si falla DynamoDB, intentamos eliminar el usuario de Cognito para mantener consistencia
                try {
                    await cognito.adminDeleteUser({
                        UserPoolId: USER_POOL_ID,
                        Username: userId
                    }).promise();
                    console.log('Usuario eliminado de Cognito después de fallo en DynamoDB');
                } catch (deleteError) {
                    console.error('Error al eliminar usuario de Cognito:', deleteError);
                }

                throw dbError;
            }

            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: 'Usuario registrado exitosamente',
                    userId
                })
            };
        } catch (cognitoError) {
            console.error('Error al crear usuario en Cognito:', cognitoError);

            // Manejar errores específicos de Cognito
            if (cognitoError.code === 'UsernameExistsException') {
                return {
                    statusCode: 409,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                    },
                    body: JSON.stringify({
                        message: 'El usuario ya existe',
                        error: cognitoError.message
                    })
                };
            }

            throw cognitoError;
        }
    } catch (error) {
        console.error('Error general al registrar usuario:', error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                message: 'Error al registrar usuario',
                error: error.message,
                stack: process.env.STAGE === 'dev' ? error.stack : undefined
            })
        };
    }
};