import apiClient from './client';

// API Endpoints - alineados con serverless.yml
const API_BASE = '/crops';
const API_USER_CROPS = '/users';

/**
 * Servicio para gestionar cultivos
 */
export const cropService = {
    /**
     * Obtiene todos los cultivos del usuario
     * @param {string} userId - ID del usuario
     * @returns {Promise} - Promesa con la respuesta
     */
    getUserCrops: (userId) => {
        return apiClient.get(`${API_USER_CROPS}/${userId}/crops`);
    },

    /**
     * Obtiene un cultivo específico por ID
     * @param {string} cropId - ID del cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    getCrop: (cropId) => {
        return apiClient.get(`${API_BASE}/${cropId}`);
    },

    /**
     * Crea un nuevo cultivo
     * @param {Object} cropData - Datos del cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    createCrop: (cropData) => {
        return apiClient.post(API_BASE, cropData);
    },

    /**
     * Actualiza un cultivo existente
     * @param {string} cropId - ID del cultivo
     * @param {Object} cropData - Datos actualizados del cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    updateCrop: (cropId, cropData) => {
        return apiClient.put(`${API_BASE}/${cropId}`, cropData);
    },

    /**
     * Elimina un cultivo
     * @param {string} cropId - ID del cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    deleteCrop: (cropId) => {
        return apiClient.delete(`${API_BASE}/${cropId}`);
    },

    /**
     * Obtiene cultivos por tipo
     * @param {string} cropType - Tipo de cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    getCropsByType: (cropType) => {
        return apiClient.get(`${API_BASE}/type/${cropType}`);
    }
}; 