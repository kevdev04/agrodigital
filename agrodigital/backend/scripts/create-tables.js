'use strict';

const AWS = require('aws-sdk');

// Configuración para DynamoDB local
const dynamoConfig = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET'
};

// Cliente DynamoDB
const dynamoDB = new AWS.DynamoDB(dynamoConfig);

// Definición de tablas
const userTableParams = {
    TableName: 'AgroDigital-Users',
    KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'email', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'email-index',
            KeySchema: [
                { AttributeName: 'email', KeyType: 'HASH' }
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

const cropsTableParams = {
    TableName: 'AgroDigital-Crops',
    KeySchema: [
        { AttributeName: 'cropId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'cropId', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' },
        { AttributeName: 'cropType', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'userId-index',
            KeySchema: [
                { AttributeName: 'userId', KeyType: 'HASH' }
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        {
            IndexName: 'cropType-index',
            KeySchema: [
                { AttributeName: 'cropType', KeyType: 'HASH' }
            ],
            Projection: {
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

// Función para crear tablas
async function createTables() {
    try {
        console.log('Creando tabla de usuarios...');
        await dynamoDB.createTable(userTableParams).promise();
        console.log('Tabla de usuarios creada con éxito.');

        console.log('Creando tabla de cultivos...');
        await dynamoDB.createTable(cropsTableParams).promise();
        console.log('Tabla de cultivos creada con éxito.');

        console.log('Todas las tablas fueron creadas exitosamente.');
    } catch (error) {
        console.error('Error al crear las tablas:', error);
    }
}

// Función para eliminar tablas
async function deleteTables() {
    try {
        console.log('Eliminando tabla de usuarios...');
        await dynamoDB.deleteTable({ TableName: 'AgroDigital-Users' }).promise();
        console.log('Tabla de usuarios eliminada con éxito.');

        console.log('Eliminando tabla de cultivos...');
        await dynamoDB.deleteTable({ TableName: 'AgroDigital-Crops' }).promise();
        console.log('Tabla de cultivos eliminada con éxito.');

        console.log('Todas las tablas fueron eliminadas exitosamente.');
    } catch (error) {
        console.error('Error al eliminar las tablas:', error);
    }
}

// Ejecutar según el comando
const command = process.argv[2];

if (command === 'create') {
    createTables();
} else if (command === 'delete') {
    deleteTables();
} else {
    console.log('Uso: node create-tables.js [create|delete]');
} 