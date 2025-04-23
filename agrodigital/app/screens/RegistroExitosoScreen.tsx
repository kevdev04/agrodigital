import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, User, Phone, MapPin, Calendar } from 'lucide-react-native';

interface UserData {
  fullName: string;
  phone: string;
  address: string;
  birthState: string;
  birthDate: string;
  gender: string;
}

export default function RegistroExitosoScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Recuperar los datos del usuario desde los parámetros de la ruta
    const userData: UserData = {
        fullName: params.fullName as string || 'Usuario AgroDigital',
        phone: params.phone as string || '123456789',
        address: params.address as string || 'Dirección no disponible',
        birthState: params.birthState as string || 'Estado no disponible',
        birthDate: params.birthDate as string || '01/01/2000',
        gender: params.gender as string || 'No especificado'
    };

    const handleContinue = () => {
        // Navegar a la vista de pestañas principal
        // @ts-ignore
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Encabezado con ícono de éxito */}
                <View style={styles.header}>
                    <CheckCircle2 size={80} color="#4CAF50" />
                    <Text style={styles.title}>¡Registro Exitoso!</Text>
                    <Text style={styles.subtitle}>Tu perfil ha sido creado correctamente</Text>
                </View>

                {/* Tarjeta con información del usuario */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Información de tu perfil</Text>

                    <View style={styles.infoItem}>
                        <User size={20} color="#4CAF50" style={styles.icon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Nombre completo</Text>
                            <Text style={styles.infoValue}>{userData.fullName}</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <Phone size={20} color="#4CAF50" style={styles.icon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Teléfono</Text>
                            <Text style={styles.infoValue}>{userData.phone}</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <MapPin size={20} color="#4CAF50" style={styles.icon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Dirección</Text>
                            <Text style={styles.infoValue}>{userData.address}</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <MapPin size={20} color="#4CAF50" style={styles.icon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Estado de nacimiento</Text>
                            <Text style={styles.infoValue}>{userData.birthState}</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <Calendar size={20} color="#4CAF50" style={styles.icon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Fecha de nacimiento</Text>
                            <Text style={styles.infoValue}>{userData.birthDate}</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <User size={20} color="#4CAF50" style={styles.icon} />
                        <View style={styles.infoContent}>
                            <Text style={styles.infoLabel}>Género</Text>
                            <Text style={styles.infoValue}>{userData.gender}</Text>
                        </View>
                    </View>
                </View>

                {/* Mensaje de bienvenida */}
                <View style={styles.welcomeContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.welcomeText}>
                        ¡Bienvenido a AgroDigital!
                    </Text>
                    <Text style={styles.welcomeMessage}>
                        Ahora puedes registrar tus terrenos, gestionar tus cultivos y
                        acceder a todas las herramientas que tenemos para ti.
                    </Text>
                </View>

                {/* Botón para continuar */}
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueButtonText}>Continuar</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginVertical: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    icon: {
        marginRight: 12,
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    welcomeContainer: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    welcomeMessage: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666',
        lineHeight: 20,
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    continueButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
}); 