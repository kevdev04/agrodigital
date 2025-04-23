'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configuración para DynamoDB local
const dynamoConfig = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET'
};

// Cliente DynamoDB
const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);

// Cargar datos de ejemplo
async function loadData() {
    try {
        // Cargar datos de usuarios
        console.log('Cargando datos de usuarios...');
        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../seed-data/users.json'), 'utf8'));

        for (const user of usersData) {
            const params = {
                TableName: 'AgroDigital-Users',
                Item: user
            };

            await docClient.put(params).promise();
            console.log(`Usuario agregado: ${user.userId}`);
        }

        // Cargar datos de cultivos
        console.log('Cargando datos de cultivos...');
        const cropsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../seed-data/crops.json'), 'utf8'));

        for (const crop of cropsData) {
            const params = {
                TableName: 'AgroDigital-Crops',
                Item: crop
            };

            await docClient.put(params).promise();
            console.log(`Cultivo agregado: ${crop.cropId}`);
        }

        console.log('Todos los datos fueron cargados exitosamente.');
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

// Ejecutar la carga de datos
loadData(); 