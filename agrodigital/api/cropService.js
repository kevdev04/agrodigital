import apiClient from './client';
import * as SecureStore from 'expo-secure-store';

// API Endpoints - alineados con serverless.yml
const API_BASE = '/crops';
const API_USER_CROPS = '/users';

// Almacenamiento en caché local
let cachedCrops = {};

/**
 * Servicio para gestionar cultivos
 */
export const cropService = {
    /**
     * Obtiene todos los cultivos del usuario
     * @param {string} userId - ID del usuario
     * @returns {Promise} - Promesa con la respuesta
     */
    getUserCrops: async (userId) => {
        try {
            // Intentar obtener desde el servidor
            const response = await apiClient.get(`${API_USER_CROPS}/${userId}/crops`);

            // Actualizar caché si se obtiene respuesta
            if (response.data) {
                cachedCrops[userId] = response.data;
                await SecureStore.setItemAsync(`user_crops_${userId}`, JSON.stringify(response.data));
            }

            return response;
        } catch (error) {
            console.error(`Error al obtener cultivos del usuario ${userId}:`, error);

            // Si hay datos en caché, usarlos
            if (cachedCrops[userId]) {
                console.log('Usando datos de cultivos en caché');
                return { data: cachedCrops[userId] };
            }

            // Intentar obtener datos del almacenamiento local
            try {
                const storedData = await SecureStore.getItemAsync(`user_crops_${userId}`);
                if (storedData) {
                    const crops = JSON.parse(storedData);
                    cachedCrops[userId] = crops;
                    console.log('Usando datos de cultivos del almacenamiento local');
                    return { data: crops };
                }
            } catch (storageError) {
                console.error('Error al obtener datos del almacenamiento local:', storageError);
            }

            // Si no hay datos, devolver array vacío
            return { data: [] };
        }
    },

    /**
     * Obtiene un cultivo específico por ID
     * @param {string} cropId - ID del cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    getCrop: async (cropId) => {
        try {
            const response = await apiClient.get(`${API_BASE}/${cropId}`);
            return response;
        } catch (error) {
            console.error(`Error al obtener cultivo ${cropId}:`, error);
            throw error;
        }
    },

    /**
     * Crea un nuevo cultivo
     * @param {Object} cropData - Datos del cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    createCrop: async (cropData) => {
        try {
            const response = await apiClient.post(API_BASE, cropData);

            // Si hay éxito, actualizar la caché de cultivos del usuario
            if (response.data && cropData.userId) {
                // Recuperar cultivos actuales
                let userCrops = [];
                try {
                    const storedData = await SecureStore.getItemAsync(`user_crops_${cropData.userId}`);
                    if (storedData) {
                        userCrops = JSON.parse(storedData);
                    }
                } catch (storageError) {
                    console.error('Error al obtener cultivos del almacenamiento:', storageError);
                }

                // Añadir el nuevo cultivo
                userCrops.push(response.data);

                // Actualizar caché y almacenamiento
                cachedCrops[cropData.userId] = userCrops;
                await SecureStore.setItemAsync(`user_crops_${cropData.userId}`, JSON.stringify(userCrops));
            }

            return response;
        } catch (error) {
            console.error('Error al crear cultivo:', error);

            // En caso de error, almacenar localmente para intentarlo después
            if (cropData.userId) {
                try {
                    // Añadir marca de pendiente para saber que no se guardó en el servidor
                    cropData.pendingSync = true;

                    // Recuperar cultivos actuales
                    let userCrops = [];
                    try {
                        const storedData = await SecureStore.getItemAsync(`user_crops_${cropData.userId}`);
                        if (storedData) {
                            userCrops = JSON.parse(storedData);
                        }
                    } catch (storageError) {
                        console.error('Error al obtener cultivos del almacenamiento:', storageError);
                    }

                    // Añadir el nuevo cultivo
                    userCrops.push(cropData);

                    // Actualizar caché y almacenamiento
                    cachedCrops[cropData.userId] = userCrops;
                    await SecureStore.setItemAsync(`user_crops_${cropData.userId}`, JSON.stringify(userCrops));

                    // Devolver respuesta simulada
                    return { data: cropData, localOnly: true };
                } catch (localError) {
                    console.error('Error al guardar cultivo localmente:', localError);
                }
            }

            throw error;
        }
    },

    /**
     * Actualiza un cultivo existente
     * @param {string} cropId - ID del cultivo
     * @param {Object} cropData - Datos actualizados del cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    updateCrop: async (cropId, cropData) => {
        try {
            const response = await apiClient.put(`${API_BASE}/${cropId}`, cropData);
            return response;
        } catch (error) {
            console.error(`Error al actualizar cultivo ${cropId}:`, error);
            throw error;
        }
    },

    /**
     * Elimina un cultivo
     * @param {string} cropId - ID del cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    deleteCrop: async (cropId) => {
        try {
            const response = await apiClient.delete(`${API_BASE}/${cropId}`);
            return response;
        } catch (error) {
            console.error(`Error al eliminar cultivo ${cropId}:`, error);
            throw error;
        }
    },

    /**
     * Obtiene cultivos por tipo
     * @param {string} cropType - Tipo de cultivo
     * @returns {Promise} - Promesa con la respuesta
     */
    getCropsByType: async (cropType) => {
        try {
            const response = await apiClient.get(`${API_BASE}/type/${cropType}`);
            return response;
        } catch (error) {
            console.error(`Error al obtener cultivos de tipo ${cropType}:`, error);
            throw error;
        }
    },

    /**
     * Sincroniza los cultivos pendientes
     * @param {string} userId - ID del usuario
     * @returns {Promise} - Promesa con el resultado de la sincronización
     */
    syncPendingCrops: async (userId) => {
        try {
            // Recuperar cultivos del usuario
            let userCrops = [];
            try {
                const storedData = await SecureStore.getItemAsync(`user_crops_${userId}`);
                if (storedData) {
                    userCrops = JSON.parse(storedData);
                }
            } catch (storageError) {
                console.error('Error al obtener cultivos del almacenamiento:', storageError);
                return { success: false, error: storageError };
            }

            // Filtrar cultivos pendientes
            const pendingCrops = userCrops.filter(crop => crop.pendingSync);

            if (pendingCrops.length === 0) {
                return { success: true, message: 'No hay cultivos pendientes de sincronizar' };
            }

            // Sincronizar cada cultivo pendiente
            const results = await Promise.all(
                pendingCrops.map(async (crop) => {
                    try {
                        // Eliminar la marca de pendiente
                        const { pendingSync, ...cropData } = crop;

                        // Enviar al servidor
                        const response = await apiClient.post(API_BASE, cropData);

                        return {
                            cropId: crop.cropId,
                            success: true,
                            data: response.data
                        };
                    } catch (error) {
                        return {
                            cropId: crop.cropId,
                            success: false,
                            error: error.message
                        };
                    }
                })
            );

            // Actualizar los cultivos locales
            const successfulSyncs = results.filter(result => result.success);
            if (successfulSyncs.length > 0) {
                // Actualizar cultivos en caché
                const updatedCrops = userCrops.map(crop => {
                    const syncResult = results.find(r => r.cropId === crop.cropId);
                    if (syncResult && syncResult.success) {
                        return { ...syncResult.data };
                    }
                    return crop;
                });

                // Guardar actualizaciones
                cachedCrops[userId] = updatedCrops;
                await SecureStore.setItemAsync(`user_crops_${userId}`, JSON.stringify(updatedCrops));
            }

            return {
                success: true,
                results,
                syncedCount: successfulSyncs.length,
                totalPending: pendingCrops.length
            };
        } catch (error) {
            console.error('Error al sincronizar cultivos pendientes:', error);
            return { success: false, error: error.message };
        }
    }
}; 