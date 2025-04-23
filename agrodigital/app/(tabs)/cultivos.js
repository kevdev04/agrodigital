import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Platform,
    ActivityIndicator,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { userService } from '@/api/userService';
import { cropService } from '@/api/cropService';

// Color constants
const COLOR_PRIMARY = Colors.light.tint;

export default function CultivosScreen() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [userCrops, setUserCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCrops, setLoadingCrops] = useState(true);
    const [syncingCrops, setSyncingCrops] = useState(false);

    // Simulated data as fallback
    const defaultUserData = {
        name: "Usuario AgroDigital",
        email: "usuario@agrodigital.com",
        address: "No disponible",
        birthState: "No disponible"
    };

    // Simulated weather data
    const weatherAlerts = [
        { type: "Sequía moderada", region: "Norte", probability: "70%", impact: "Medio" },
        { type: "Lluvia intensa", region: "Sur", probability: "40%", impact: "Alto" }
    ];

    // Cargar datos del usuario
    useEffect(() => {
        loadUserData();
        loadCrops();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const response = await userService.getProfile();
            if (response && response.data) {
                setUserData(response.data);
                console.log("Datos de usuario cargados:", response.data);
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

    const loadCrops = async () => {
        try {
            setLoadingCrops(true);
            // ID de usuario fijo para pruebas
            const userId = "user123";
            const response = await cropService.getUserCrops(userId);
            if (response && response.data) {
                setUserCrops(response.data);
                console.log("Cultivos cargados:", response.data);
            }
        } catch (error) {
            console.error('Error al cargar cultivos:', error);
            // Usar datos por defecto en caso de error
            setUserCrops([
                { name: "Maíz", area: 12, status: "En crecimiento", health: 85, cropId: "default1" },
                { name: "Frijol", area: 5, status: "Recién plantado", health: 90, cropId: "default2" }
            ]);
        } finally {
            setLoadingCrops(false);
        }
    };

    // Función para sincronizar cultivos pendientes
    const handleSyncCrops = async () => {
        try {
            setSyncingCrops(true);
            const userId = "user123"; // ID de usuario fijo para pruebas
            const result = await cropService.syncPendingCrops(userId);

            if (result.success) {
                if (result.syncedCount > 0) {
                    Alert.alert(
                        "Sincronización exitosa",
                        `Se han sincronizado ${result.syncedCount} de ${result.totalPending} cultivos pendientes.`
                    );
                    // Refrescar datos después de sincronizar
                    loadCrops();
                } else if (result.totalPending === 0) {
                    Alert.alert("Información", "No hay cultivos pendientes de sincronizar.");
                } else {
                    Alert.alert(
                        "Sincronización parcial",
                        `No se pudieron sincronizar algunos cultivos. Intente nuevamente más tarde.`
                    );
                }
            } else {
                Alert.alert("Error", "No se pudieron sincronizar los cultivos. Verifique su conexión.");
            }
        } catch (error) {
            console.error('Error al sincronizar cultivos:', error);
            Alert.alert("Error", "Ocurrió un problema al sincronizar los cultivos.");
        } finally {
            setSyncingCrops(false);
        }
    };

    // Función para refrescar los datos
    const handleRefresh = () => {
        loadUserData();
        loadCrops();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mis Cultivos</Text>
                <View style={styles.headerButtons}>
                    {syncingCrops ? (
                        <ActivityIndicator color="#fff" size="small" style={styles.syncingIndicator} />
                    ) : (
                        <TouchableOpacity onPress={handleSyncCrops} style={styles.syncButton}>
                            <Feather name="upload-cloud" size={20} color="#fff" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                        <Feather name="refresh-cw" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* User Information Card */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLOR_PRIMARY} />
                        <Text style={styles.loadingText}>Cargando datos...</Text>
                    </View>
                ) : (
                    <View style={styles.userInfoCard}>
                        <View style={styles.userInfoHeader}>
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={styles.userAvatar}
                            />
                            <View style={styles.userDetails}>
                                <Text style={styles.userName}>{userData?.name || 'Usuario AgroDigital'}</Text>
                                <Text style={styles.userEmail}>{userData?.email || 'No disponible'}</Text>
                            </View>
                        </View>
                        <View style={styles.userInfoContent}>
                            <View style={styles.userInfoItem}>
                                <Feather name="map-pin" size={16} color={COLOR_PRIMARY} />
                                <Text style={styles.userInfoText}>{userData?.address || 'No especificado'}</Text>
                            </View>
                            {userData?.birthState && (
                                <View style={styles.userInfoItem}>
                                    <Feather name="map" size={16} color={COLOR_PRIMARY} />
                                    <Text style={styles.userInfoText}>Estado: {userData.birthState}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Crop Cards */}
                {loadingCrops ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLOR_PRIMARY} />
                        <Text style={styles.loadingText}>Cargando cultivos...</Text>
                    </View>
                ) : userCrops.length > 0 ? (
                    userCrops.map((crop, index) => (
                        <View key={crop.cropId || index} style={styles.card}>
                            <View style={styles.cropHeader}>
                                <Text style={styles.cropName}>{crop.name}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>{crop.status || "Activo"}</Text>
                                </View>
                            </View>

                            <View style={styles.cropDetails}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Área</Text>
                                    <Text style={styles.detailValue}>{crop.area || 0} hectáreas</Text>
                                </View>

                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Salud</Text>
                                    <View style={styles.healthBar}>
                                        <View style={styles.progressBarBackground}>
                                            <View
                                                style={[
                                                    styles.progressBar,
                                                    { width: `${crop.health || 75}%` }
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.healthText}>{crop.health || 75}%</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.actionButton}>
                                    <Feather name="camera" size={16} color="#fff" />
                                    <Text style={styles.actionButtonText}>Monitorear</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.actionButton, styles.statisticsButton]}>
                                    <Feather name="bar-chart-2" size={16} color="#fff" />
                                    <Text style={styles.actionButtonText}>Estadísticas</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.noDataContainer}>
                        <Feather name="alert-circle" size={40} color={COLOR_PRIMARY} />
                        <Text style={styles.noDataText}>No tienes cultivos registrados</Text>
                        <Text style={styles.noDataSubtext}>Registra tu primer cultivo usando el botón abajo</Text>
                    </View>
                )}

                {/* Register New Crop */}
                <TouchableOpacity
                    style={styles.registerCard}
                    onPress={() => router.push('/screens/RegistroTerrenoScreen')}
                >
                    <Feather name="plus-circle" size={40} color="#9ca3af" />
                    <Text style={styles.registerTitle}>Registrar Nuevo Cultivo</Text>
                    <Text style={styles.registerSubtitle}>Añade información sobre tu nuevo cultivo</Text>
                </TouchableOpacity>

                {/* Weather Alerts */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Alertas Climáticas</Text>

                    {weatherAlerts.map((alert, index) => (
                        <View key={index} style={styles.alertItem}>
                            <View style={[
                                styles.alertIcon,
                                alert.type.includes("Sequía") ? styles.sunIcon : styles.rainIcon
                            ]}>
                                <Feather
                                    name={alert.type.includes("Sequía") ? "sun" : "cloud-rain"}
                                    size={20}
                                    color={alert.type.includes("Sequía") ? "#dc2626" : "#3b82f6"}
                                />
                            </View>

                            <View style={styles.alertDetails}>
                                <Text style={styles.alertTitle}>{alert.type}</Text>
                                <Text style={styles.alertRegion}>Región: {alert.region}</Text>
                                <View style={styles.alertMetrics}>
                                    <Text style={styles.alertMetric}>Probabilidad: {alert.probability}</Text>
                                    <Text style={styles.alertMetric}>Impacto: {alert.impact}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.seeAllButton}>
                        <Text style={styles.seeAllButtonText}>Ver todas las alertas</Text>
                    </TouchableOpacity>
                </View>

                {/* Recommendations */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Recomendaciones</Text>

                    <View style={styles.recommendationItem}>
                        <View style={styles.recommendationIcon}>
                            <Feather name="droplet" size={20} color="#059669" />
                        </View>

                        <View style={styles.recommendationDetails}>
                            <Text style={styles.recommendationTitle}>Optimización de riego</Text>
                            <Text style={styles.recommendationDescription}>
                                Reducir riego en 20% por alerta de sequía
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.recommendationItem, styles.lastItem]}>
                        <View style={[styles.recommendationIcon, styles.blueIcon]}>
                            <Feather name="file-text" size={20} color="#2563eb" />
                        </View>

                        <View style={styles.recommendationDetails}>
                            <Text style={styles.recommendationTitle}>Contrato de seguro</Text>
                            <Text style={styles.recommendationDescription}>
                                Asegura tu cosecha ante riesgos climáticos
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    syncButton: {
        backgroundColor: '#4f46e5',
        padding: 8,
        borderRadius: 20,
        marginRight: 8,
    },
    syncingIndicator: {
        marginRight: 8,
    },
    refreshButton: {
        backgroundColor: COLOR_PRIMARY,
        padding: 8,
        borderRadius: 20,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    loadingText: {
        marginTop: 10,
        color: Colors.light.text,
        fontSize: 14,
    },
    noDataContainer: {
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    noDataText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
    },
    noDataSubtext: {
        marginTop: 8,
        textAlign: 'center',
        color: Colors.light.icon,
        paddingHorizontal: 20,
    },
    userInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    userInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userDetails: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
    },
    userEmail: {
        fontSize: 12,
        color: Colors.light.icon,
        marginTop: 2,
    },
    userInfoContent: {
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 12,
    },
    userInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userInfoText: {
        fontSize: 14,
        color: Colors.light.text,
        marginLeft: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    cropHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    cropName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
    },
    statusBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        color: COLOR_PRIMARY,
        fontWeight: '500',
    },
    cropDetails: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        color: Colors.light.icon,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.light.text,
    },
    healthBar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBarBackground: {
        height: 10,
        backgroundColor: '#f3f4f6',
        borderRadius: 5,
        flex: 1,
        marginRight: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: COLOR_PRIMARY,
        borderRadius: 5,
    },
    healthText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.light.text,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: COLOR_PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
    },
    statisticsButton: {
        backgroundColor: '#4f46e5',
        marginRight: 0,
        marginLeft: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 6,
    },
    registerCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#f3f4f6',
        borderStyle: 'dashed',
    },
    registerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
        marginTop: 16,
        marginBottom: 4,
    },
    registerSubtitle: {
        fontSize: 14,
        color: Colors.light.icon,
        textAlign: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 16,
    },
    alertItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    alertIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sunIcon: {
        backgroundColor: '#fee2e2',
    },
    rainIcon: {
        backgroundColor: '#dbeafe',
    },
    alertDetails: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    alertRegion: {
        fontSize: 14,
        color: Colors.light.icon,
        marginBottom: 4,
    },
    alertMetrics: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    alertMetric: {
        fontSize: 12,
        color: Colors.light.icon,
        marginRight: 12,
    },
    seeAllButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginTop: 8,
    },
    seeAllButtonText: {
        color: COLOR_PRIMARY,
        fontSize: 14,
        fontWeight: '500',
    },
    recommendationItem: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingBottom: 16,
        marginBottom: 16,
    },
    lastItem: {
        borderBottomWidth: 0,
        paddingBottom: 0,
        marginBottom: 0,
    },
    recommendationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    blueIcon: {
        backgroundColor: '#eff6ff',
    },
    recommendationDetails: {
        flex: 1,
    },
    recommendationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    recommendationDescription: {
        fontSize: 14,
        color: Colors.light.icon,
    },
}); 