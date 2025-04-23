'use strict';

const CropModel = require('../../models/crop/CropModel');

/**
 * Crear un nuevo cultivo
 */
exports.createCrop = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);

        // Validar datos requeridos
        if (!requestBody.userId || !requestBody.name || !requestBody.cropType) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'Se requieren userId, name y cropType'
                })
            };
        }

        const newCrop = await CropModel.createCrop(requestBody);

        return {
            statusCode: 201,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(newCrop)
        };
    } catch (error) {
        console.error('Error creating crop:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Error al crear el cultivo',
                details: error.message
            })
        };
    }
};

/**
 * Obtener un cultivo por ID
 */
exports.getCrop = async (event) => {
    try {
        const cropId = event.pathParameters.cropId;

        const crop = await CropModel.getCropById(cropId);

        if (!crop) {
            return {
                statusCode: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    error: 'Cultivo no encontrado'
                })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(crop)
        };
    } catch (error) {
        console.error('Error getting crop:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Error al obtener el cultivo',
                details: error.message
            })
        };
    }
};

/**
 * Obtener cultivos por usuario
 */
exports.getUserCrops = async (event) => {
    try {
        const userId = event.pathParameters.userId;

        const crops = await CropModel.getCropsByUserId(userId);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(crops)
        };
    } catch (error) {
        console.error('Error getting user crops:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Error al obtener los cultivos del usuario',
                details: error.message
            })
        };
    }
};

/**
 * Actualizar un cultivo
 */
exports.updateCrop = async (event) => {
    try {
        const cropId = event.pathParameters.cropId;
        const requestBody = JSON.parse(event.body);

        const updatedCrop = await CropModel.updateCrop(cropId, requestBody);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(updatedCrop)
        };
    } catch (error) {
        console.error('Error updating crop:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Error al actualizar el cultivo',
                details: error.message
            })
        };
    }
};

/**
 * Eliminar un cultivo
 */
exports.deleteCrop = async (event) => {
    try {
        const cropId = event.pathParameters.cropId;

        await CropModel.deleteCrop(cropId);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                message: 'Cultivo eliminado correctamente'
            })
        };
    } catch (error) {
        console.error('Error deleting crop:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Error al eliminar el cultivo',
                details: error.message
            })
        };
    }
};

/**
 * Obtener cultivos por tipo
 */
exports.getCropsByType = async (event) => {
    try {
        const cropType = event.pathParameters.cropType;

        const crops = await CropModel.getCropsByType(cropType);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(crops)
        };
    } catch (error) {
        console.error('Error getting crops by type:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                error: 'Error al obtener los cultivos por tipo',
                details: error.message
            })
        };
    }
}; 