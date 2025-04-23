import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
    const router = useRouter();
    
    const handleLogout = () => {
        // Navigate to the welcome screen (root index.tsx)
        router.replace('/index');
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mi Perfil</Text>
            </View>

            <View style={styles.profileCard}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>Usuario AgroDigital</Text>
                <Text style={styles.email}>usuario@agrodigital.com</Text>

                <View style={styles.infoRow}>
                    <Feather name="map-pin" size={18} color={Colors.light.icon} />
                    <Text style={styles.infoText}>Región Agrícola</Text>
                </View>

                <View style={styles.infoRow}>
                    <Feather name="phone" size={18} color={Colors.light.icon} />
                    <Text style={styles.infoText}>+52 123 456 7890</Text>
                </View>
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

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
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