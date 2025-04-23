import React from 'react';
import { View } from 'react-native';
import CultivosScreenBasic from '../screens/CultivosScreenBasic';
import { useRouter } from 'expo-router';

export default function CultivosPage() {
    const router = useRouter();

    // Esta función se pasará a CultivosScreen para manejar la navegación a RegistroTerrenoScreen
    const handleAddCrop = () => {
        router.push('/screens/RegistroTerrenoScreen');
    };

    return <CultivosScreenBasic onAddCrop={handleAddCrop} />;
} 