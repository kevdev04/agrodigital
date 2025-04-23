'use strict';

const { v4: uuidv4 } = require('uuid');

// Simulación de base de datos en memoria
const database = {
    crops: [
        {
            cropId: "crop-001",
            userId: "user123",
            name: "Maíz Amarillo",
            cropType: "Maíz",
            plantDate: "2023-04-15",
            location: "Parcela Norte",
            area: 5.2,
            status: "active",
            notes: "Variedad resistente a sequía",
            createdAt: "2023-05-12T15:30:45.123Z",
            updatedAt: "2023-05-12T15:30:45.123Z"
        },
        {
            cropId: "crop-002",
            userId: "user123",
            name: "Frijol Negro",
            cropType: "Frijol",
            plantDate: "2023-03-10",
            location: "Parcela Sur",
            area: 3.5,
            status: "harvested",
            notes: "Cultivo finalizado",
            createdAt: "2023-03-05T10:15:30.456Z",
            updatedAt: "2023-06-20T14:25:10.789Z"
        },
        {
            cropId: "crop-003",
            userId: "user456",
            name: "Maíz Blanco",
            cropType: "Maíz",
            plantDate: "2023-02-20",
            location: "Parcela Este",
            area: 4.0,
            status: "active",
            notes: "Cultivo experimental",
            createdAt: "2023-02-15T11:20:35.789Z",
            updatedAt: "2023-02-15T11:20:35.789Z"
        }
    ]
};

/**
 * Modelo para manejar cultivos (implementación en memoria para desarrollo)
 */
class CropModel {
    /**
     * Crear un nuevo cultivo
     * @param {Object} cropData - Datos del cultivo
     * @returns {Promise} - Promesa con el resultado
     */
    static async createCrop(cropData) {
        try {
            const timestamp = new Date().toISOString();
            const cropId = uuidv4();

            const newCrop = {
                cropId,
                userId: cropData.userId,
                cropType: cropData.cropType,
                name: cropData.name,
                plantDate: cropData.plantDate,
                location: cropData.location,
                area: cropData.area,
                status: cropData.status || 'active',
                notes: cropData.notes || '',
                createdAt: timestamp,
                updatedAt: timestamp
            };

            database.crops.push(newCrop);
            return newCrop;
        } catch (error) {
            console.error('Error creating crop:', error);
            throw new Error('No se pudo crear el cultivo');
        }
    }

    /**
     * Obtener un cultivo por su ID
     * @param {String} cropId - ID del cultivo
     * @returns {Promise} - Promesa con el cultivo
     */
    static async getCropById(cropId) {
        try {
            const crop = database.crops.find(c => c.cropId === cropId);
            return crop || null;
        } catch (error) {
            console.error('Error getting crop:', error);
            throw new Error('No se pudo obtener el cultivo');
        }
    }

    /**
     * Obtener cultivos por usuario
     * @param {String} userId - ID del usuario
     * @returns {Promise} - Promesa con los cultivos
     */
    static async getCropsByUserId(userId) {
        try {
            const crops = database.crops.filter(c => c.userId === userId);
            return crops;
        } catch (error) {
            console.error('Error getting crops by user:', error);
            throw new Error('No se pudieron obtener los cultivos del usuario');
        }
    }

    /**
     * Actualizar un cultivo
     * @param {String} cropId - ID del cultivo
     * @param {Object} updateData - Datos a actualizar
     * @returns {Promise} - Promesa con el resultado
     */
    static async updateCrop(cropId, updateData) {
        try {
            const cropIndex = database.crops.findIndex(c => c.cropId === cropId);

            if (cropIndex === -1) {
                throw new Error('Cultivo no encontrado');
            }

            const updatedAt = new Date().toISOString();
            const allowedFields = [
                'name', 'cropType', 'plantDate', 'location',
                'area', 'status', 'notes'
            ];

            const updatedCrop = { ...database.crops[cropIndex] };

            // Actualizar campos permitidos
            for (const field of allowedFields) {
                if (field in updateData) {
                    updatedCrop[field] = updateData[field];
                }
            }

            updatedCrop.updatedAt = updatedAt;
            database.crops[cropIndex] = updatedCrop;

            return updatedCrop;
        } catch (error) {
            console.error('Error updating crop:', error);
            throw new Error('No se pudo actualizar el cultivo');
        }
    }

    /**
     * Eliminar un cultivo
     * @param {String} cropId - ID del cultivo
     * @returns {Promise} - Promesa con el resultado
     */
    static async deleteCrop(cropId) {
        try {
            const cropIndex = database.crops.findIndex(c => c.cropId === cropId);

            if (cropIndex === -1) {
                throw new Error('Cultivo no encontrado');
            }

            database.crops.splice(cropIndex, 1);

            return { message: 'Cultivo eliminado correctamente' };
        } catch (error) {
            console.error('Error deleting crop:', error);
            throw new Error('No se pudo eliminar el cultivo');
        }
    }

    /**
     * Obtener cultivos por tipo
     * @param {String} cropType - Tipo de cultivo
     * @returns {Promise} - Promesa con los cultivos
     */
    static async getCropsByType(cropType) {
        try {
            const crops = database.crops.filter(c => c.cropType === cropType);
            return crops;
        } catch (error) {
            console.error('Error getting crops by type:', error);
            throw new Error('No se pudieron obtener los cultivos por tipo');
        }
    }
}

module.exports = CropModel; 