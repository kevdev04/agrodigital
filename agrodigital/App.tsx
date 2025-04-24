import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator } from 'react-native';

// Import secure config utilities
import { initializeSecureCredentials, configureAmplify } from './src/utils/secureConfig';

export default function App() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupApp = async () => {
      try {
        // First initialize secure credentials
        await initializeSecureCredentials();
        
        // Then configure Amplify with those credentials
        const success = await configureAmplify();
        setIsConfigured(success);
      } catch (error) {
        console.error('Error setting up app:', error);
        setIsConfigured(false);
      } finally {
        setIsLoading(false);
      }
    };

    setupApp();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00875F" />
        <Text style={{ marginTop: 10 }}>Inicializando aplicación...</Text>
      </View>
    );
  }

  if (!isConfigured) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Error al configurar la aplicación. Por favor reinicie la aplicación o contacte a soporte.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* Your app code */}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
} 