import apiClient from './client';

export const cropService = {
    // Obtener todos los cultivos de un usuario
    getUserCrops: async (userId) => {
        return apiClient.get(`/users/${userId}/crops`);
    },

    // Obtener un cultivo específico
    getCrop: async (cropId) => {
        return apiClient.get(`/crops/${cropId}`);
    },

    // Crear un nuevo cultivo
    createCrop: async (cropData) => {
        return apiClient.post('/crops', cropData);
    },

    // Actualizar un cultivo existente
    updateCrop: async (cropId, cropData) => {
        return apiClient.put(`/crops/${cropId}`, cropData);
    },

    // Eliminar un cultivo
    deleteCrop: async (cropId) => {
        return apiClient.delete(`/crops/${cropId}`);
    },

    // Obtener cultivos por tipo
    getCropsByType: async (cropType) => {
        return apiClient.get(`/crops/type/${cropType}`);
    }
}; 