import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configuración base
const apiClient = axios.create({
    baseURL: 'https://eni0ukqpp8.execute-api.us-east-1.amazonaws.com/dev', // URL real del backend desplegado
    timeout: 10000, // Timeout en milisegundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para agregar token a todas las peticiones
apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        } catch (error) {
            console.error('Error al obtener el token:', error);
            return config;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // Si hay un error 401 (no autorizado), podríamos intentar renovar el token
        if (error.response && error.response.status === 401) {
            console.log('Sesión expirada o token inválido');
            // Aquí podrías implementar la lógica para renovar el token o redirigir al login
        }
        return Promise.reject(error);
    }
);

export default apiClient;
