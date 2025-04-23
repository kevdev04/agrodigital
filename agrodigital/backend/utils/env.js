'use strict';

const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno basadas en el entorno actual
const loadEnv = () => {
    const stage = process.env.STAGE || 'dev';
    const envPath = path.resolve(process.cwd(), `.env.${stage}`);
    const defaultPath = path.resolve(process.cwd(), '.env');

    // Intentar cargar el archivo específico del entorno primero
    const result = dotenv.config({ path: envPath });

    // Si no existe, cargar el archivo .env por defecto
    if (result.error) {
        dotenv.config({ path: defaultPath });
    }

    // Configurar el AWS SDK
    if (process.env.AWS_REGION) {
        process.env.AWS_SDK_LOAD_CONFIG = 1;
        process.env.AWS_REGION = process.env.AWS_REGION;
    }
};

module.exports = {
    loadEnv,
}; 