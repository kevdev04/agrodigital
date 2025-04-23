import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { cropService } from '../../api/cropService';
import { Leaf, BarChart2, RefreshCw, Plus, ChevronRight } from 'lucide-react-native';

// Definición de la estructura de datos de un cultivo
interface Crop {
  cropId: string;
  userId: string;
  name: string;
  cropType: string;
  plantDate: string;
  location: string;
  area: number;
  status: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Modificar la interfaz de propiedades para el componente
interface CultivosScreenProps {
  onAddCrop?: () => void;
}

export default function CultivosScreen({ onAddCrop }: CultivosScreenProps) {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Función para cargar los cultivos
  const loadCrops = async () => {
    try {
      setLoading(true);
      // En una app real, este ID vendría del sistema de autenticación
      const userId = 'user123';
      console.log('Obteniendo cultivos para el usuario:', userId);
      const response = await cropService.getUserCrops(userId);
      console.log('Respuesta del servidor:', response.data);
      setCrops(response.data);
    } catch (error) {
      console.error('Error al cargar cultivos:', error);
      Alert.alert('Error', 'No se pudieron cargar los cultivos. Por favor intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar cultivos al montar el componente
  useEffect(() => {
    loadCrops();
  }, []);

  // Función para refrescar los datos
  const onRefresh = () => {
    setRefreshing(true);
    loadCrops();
  };

  // Función para navegar a la pantalla de registro
  const handleAddCrop = () => {
    if (onAddCrop) {
      onAddCrop();
    } else {
      router.push('/screens/RegistroTerrenoScreen');
    }
  };

  // Función para ver detalles de un cultivo
  const handleViewCrop = (cropId: string) => {
    // En una app real, navegaríamos a una pantalla de detalles
    Alert.alert('Ver cultivo', `Ver detalles del cultivo ${cropId}`);
  };

  // Función para mostrar el estado del cultivo
  const renderStatus = (status: string) => {
    let statusColor = Colors.light.icon;
    let statusText = 'Desconocido';

    switch (status) {
      case 'active':
        statusColor = '#4CAF50'; // Verde
        statusText = 'Activo';
        break;
      case 'harvested':
        statusColor = '#2196F3'; // Azul
        statusText = 'Cosechado';
        break;
      case 'problem':
        statusColor = '#FF9800'; // Naranja
        statusText = 'Con problemas';
        break;
      case 'inactive':
        statusColor = '#9E9E9E'; // Gris
        statusText = 'Inactivo';
        break;
    }

    return (
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    );
  };

  // Renderizado de cada ítem de la lista
  const renderCropItem = ({ item }: { item: Crop }) => (
    <TouchableOpacity
      style={styles.cropCard}
      onPress={() => handleViewCrop(item.cropId)}
    >
      <View style={styles.cropIconContainer}>
        <Leaf size={24} color={Colors.light.tint} />
      </View>
      <View style={styles.cropDetails}>
        <Text style={styles.cropName}>{item.name}</Text>
        <Text style={styles.cropInfo}>
          Área: {item.area} hectáreas • Tipo: {item.cropType}
        </Text>
        <Text style={styles.cropDate}>
          Plantado: {new Date(item.plantDate).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.cropActions}>
        {renderStatus(item.status)}
        <ChevronRight size={20} color={Colors.light.icon} style={styles.chevron} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Cultivos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddCrop}
        >
          <Plus size={20} color="#FFF" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loaderText}>Cargando cultivos...</Text>
        </View>
      ) : crops.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>No tienes cultivos registrados</Text>
          <Text style={styles.emptyText}>
            Comienza agregando tu primer cultivo haciendo clic en el botón Agregar.
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={handleAddCrop}
          >
            <Text style={styles.emptyButtonText}>Agregar cultivo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={crops}
          renderItem={renderCropItem}
          keyExtractor={(item) => item.cropId}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.light.tint]}
              tintColor={Colors.light.tint}
            />
          }
        />
      )}

      <View style={styles.statsBar}>
        <TouchableOpacity style={styles.statsButton}>
          <BarChart2 size={20} color={Colors.light.text} />
          <Text style={styles.statsText}>Estadísticas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={onRefresh}
        >
          <RefreshCw size={20} color={Colors.light.text} />
          <Text style={styles.statsText}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 5,
  },
  listContainer: {
    padding: 16,
  },
  cropCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cropIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cropDetails: {
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  cropInfo: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 2,
  },
  cropDate: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  cropActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  chevron: {
    marginTop: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.icon,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.icon,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.light.text,
  },
}); 