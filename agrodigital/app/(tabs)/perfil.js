import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { userService } from '../../api/userService';

export default function PerfilScreen() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Datos por defecto en caso de error o mientras carga
    const defaultUserData = {
        name: "Usuario AgroDigital",
        email: "usuario@agrodigital.com",
        address: "No especificado",
        phone: "No especificado",
        birthDate: "",
        gender: ""
    };

    useEffect(() => {
        // Cargar datos del usuario al montar el componente
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const response = await userService.getProfile();
            if (response && response.data) {
                setUserData(response.data);
                console.log("Datos de usuario cargados en perfil:", response.data);
            } else {
                console.log("No se recibieron datos de usuario del servidor");
                setUserData(defaultUserData);
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
            // Usar datos por defecto en caso de error
            setUserData(defaultUserData);
            Alert.alert(
                "Error de conexión",
                "No se pudieron cargar tus datos de perfil. Mostrando información básica."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        loadUserData();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Mi Perfil</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.light.tint} />
                    <Text style={styles.loadingText}>Cargando datos del perfil...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mi Perfil</Text>
                <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
                    <Feather name="refresh-cw" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.profileCard}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{userData?.name || 'Usuario AgroDigital'}</Text>
                <Text style={styles.email}>{userData?.email || 'usuario@agrodigital.com'}</Text>

                <View style={styles.infoRow}>
                    <Feather name="map-pin" size={18} color={Colors.light.icon} />
                    <Text style={styles.infoText}>{userData?.address || 'No especificado'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Feather name="phone" size={18} color={Colors.light.icon} />
                    <Text style={styles.infoText}>{userData?.phone || 'No especificado'}</Text>
                </View>

                {userData?.birthDate && (
                    <View style={styles.infoRow}>
                        <Feather name="calendar" size={18} color={Colors.light.icon} />
                        <Text style={styles.infoText}>Fecha de nacimiento: {userData.birthDate}</Text>
                    </View>
                )}

                {userData?.gender && (
                    <View style={styles.infoRow}>
                        <Feather name="user" size={18} color={Colors.light.icon} />
                        <Text style={styles.infoText}>Género: {userData.gender}</Text>
                    </View>
                )}
            </View>

            <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Configuración</Text>

                <TouchableOpacity style={styles.settingRow}>
                    <Feather name="user" size={20} color={Colors.light.tint} />
                    <Text style={styles.settingText}>Editar Perfil</Text>
                    <Feather name="chevron-right" size={20} color={Colors.light.icon} style={styles.chevron} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingRow}>
                    <Feather name="bell" size={20} color={Colors.light.tint} />
                    <Text style={styles.settingText}>Notificaciones</Text>
                    <Feather name="chevron-right" size={20} color={Colors.light.icon} style={styles.chevron} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingRow}>
                    <Feather name="help-circle" size={20} color={Colors.light.tint} />
                    <Text style={styles.settingText}>Ayuda</Text>
                    <Feather name="chevron-right" size={20} color={Colors.light.icon} style={styles.chevron} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <Feather name="log-out" size={20} color="white" />
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        backgroundColor: Colors.light.tint,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    refreshButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 8,
        borderRadius: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.light.text,
    },
    profileCard: {
        margin: 20,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: Colors.light.icon,
        marginBottom: 15,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    infoText: {
        marginLeft: 10,
        color: Colors.light.icon,
    },
    settingsSection: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingText: {
        flex: 1,
        marginLeft: 10,
    },
    chevron: {
        marginLeft: 'auto',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        margin: 20,
        padding: 15,
        borderRadius: 10,
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    },
}); 