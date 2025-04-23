import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams, Redirect } from 'expo-router';

export default function RedirectToRegistroExitoso() {
    const params = useLocalSearchParams();

    // Este componente simplemente redirige a la pantalla real
    return <Redirect href={`/screens/RegistroExitosoScreen?${new URLSearchParams(params).toString()}`} />;
} 