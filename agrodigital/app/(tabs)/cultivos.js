import React from 'react';
import { View } from 'react-native';
import CultivosScreen from '../screens/CultivosScreen';
import { useRouter } from 'expo-router';

export default function CultivosPage() {
    const router = useRouter();

    // Esta función se pasará a CultivosScreen para manejar la navegación a RegistroTerrenoScreen
    const handleAddCrop = () => {
        try {
            // @ts-ignore - Ignorar errores de tipos
            router.push("/screens/RegistroTerrenoScreen");
        } catch (error) {
            console.error('Error al navegar:', error);
        }
    };

    return <CultivosScreen onAddCrop={handleAddCrop} />;
} 