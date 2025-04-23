import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://eni0ukqpp8.execute-api.us-east-1.amazonaws.com/dev';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir token de autenticación
apiClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
