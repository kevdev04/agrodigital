'use strict';

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const cognito = new AWS.CognitoIdentityServiceProvider();

const USER_POOL_ID = process.env.USER_POOL_ID;
const USER_TABLE = process.env.USER_TABLE;

// Obtener perfil de usuario
module.exports.getProfile = async (event) => {
    try {
        const userId = event.requestContext.authorizer.claims.sub;

        // Obtener datos del usuario de DynamoDB
        const params = {
            TableName: USER_TABLE,
            Key: {
                userId
            }
        };

        const result = await dynamodb.get(params).promise();
        const user = result.Item;

        if (!user) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: 'Usuario no encontrado'
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                user: {
                    userId: user.userId,
                    email: user.email,
                    name: user.name,
                    phoneNumber: user.phoneNumber,
                    createdAt: user.createdAt,
                    status: user.status
                }
            })
        };
    } catch (error) {
        console.error('Error al obtener perfil:', error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                message: 'Error al obtener perfil',
                error: error.message
            })
        };
    }
};

// Actualizar perfil de usuario
module.exports.updateProfile = async (event) => {
    try {
        const userId = event.requestContext.authorizer.claims.sub;
        const body = JSON.parse(event.body);
        const { name, phoneNumber } = body;

        // Actualizar en Cognito si hay cambios en el nombre
        if (name) {
            const cognitoParams = {
                UserPoolId: USER_POOL_ID,
                Username: userId,
                UserAttributes: [
                    {
                        Name: 'name',
                        Value: name
                    }
                ]
            };

            await cognito.adminUpdateUserAttributes(cognitoParams).promise();
        }

        // Preparar los atributos a actualizar en DynamoDB
        const updateExpressions = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        if (name) {
            updateExpressions.push('#name = :name');
            expressionAttributeNames['#name'] = 'name';
            expressionAttributeValues[':name'] = name;
        }

        if (phoneNumber) {
            updateExpressions.push('#phoneNumber = :phoneNumber');
            expressionAttributeNames['#phoneNumber'] = 'phoneNumber';
            expressionAttributeValues[':phoneNumber'] = phoneNumber;
        }

        // Si no hay nada que actualizar
        if (updateExpressions.length === 0) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: 'No se proporcionaron datos para actualizar'
                })
            };
        }

        // Actualizar en DynamoDB
        const updateParams = {
            TableName: USER_TABLE,
            Key: {
                userId
            },
            UpdateExpression: 'SET ' + updateExpressions.join(', '),
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamodb.update(updateParams).promise();
        const updatedUser = result.Attributes;

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                message: 'Perfil actualizado exitosamente',
                user: {
                    userId: updatedUser.userId,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    phoneNumber: updatedUser.phoneNumber,
                    status: updatedUser.status
                }
            })
        };
    } catch (error) {
        console.error('Error al actualizar perfil:', error);

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                message: 'Error al actualizar perfil',
                error: error.message
            })
        };
    }
};
