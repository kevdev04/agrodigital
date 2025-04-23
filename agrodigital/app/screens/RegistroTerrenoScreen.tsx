import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as DocumentPicker from 'expo-document-picker';
import { 
  Camera, 
  FileText, 
  MapPin, 
  Upload, 
  Check, 
  ChevronLeft, 
  Info 
} from 'lucide-react-native';
import { cropService } from '@/api/cropService';

// Color constants matching the app theme
const COLOR_PRIMARY = Colors.light.tint;
const COLOR_GRAY = Colors.light.icon;
const COLOR_ERROR = '#DC3545';
const COLOR_BORDER_LIGHT = '#E5E7EB';
const COLOR_TEXT_SECONDARY = Colors.light.icon;

// Define types for our state
interface TerrainData {
  hectareas: string;
  metros: string;
  cultivo: string;
  descripcion: string;
}

export default function RegistroTerrenoScreen() {
  const router = useRouter();
  
  // Form state
  const [terrainData, setTerrainData] = useState<TerrainData>({
    hectareas: '',
    metros: '',
    cultivo: '',
    descripcion: '',
  });

  // Media and document state
  const [photos, setPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [documents, setDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  // Loading states
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // Agreement checkbox states
  const [agreementChecked, setAgreementChecked] = useState(false);
  
  // Permission states
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
      
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationStatus.status === 'granted');
    })();
  }, []);

  // Input change handler
  const handleInputChange = (field: keyof TerrainData, value: string) => {
    setTerrainData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Image picker function
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 5,
      });
      
      if (!result.canceled) {
        setPhotos(prev => [...prev, ...result.assets]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las imágenes.');
    }
  };

  // Camera function
  const takePhoto = async () => {
    if (!cameraPermission) {
      Alert.alert(
        'Permiso requerido', 
        'Necesitamos permiso para acceder a tu cámara',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Configuración', 
            onPress: () => Platform.OS === 'ios' 
              ? Linking.openURL('app-settings:') 
              : Linking.openSettings() 
          }
        ]
      );
      return;
    }
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setPhotos(prev => [...prev, ...result.assets]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto.');
    }
  };

  // Document picker function
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: true,
      });
      
      if (result.canceled === false && result.assets) {
        setDocuments(prev => [...prev, ...result.assets]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los documentos.');
    }
  };

  // Location function
  const getLocation = async () => {
    if (!locationPermission) {
      Alert.alert(
        'Permiso requerido', 
        'Necesitamos permiso para acceder a tu ubicación',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Configuración', 
            onPress: () => Platform.OS === 'ios' 
              ? Linking.openURL('app-settings:') 
              : Linking.openSettings() 
          }
        ]
      );
      return;
    }
    
    setIsLoadingLocation(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
      Alert.alert('Ubicación obtenida', 'La ubicación se guardó correctamente.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Remove photo
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Remove document
  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form function
  const handleSubmit = async () => {
    // Validaciones
    if (!terrainData.hectareas.trim() || !terrainData.cultivo.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos.');
      return;
    }

    if (photos.length === 0) {
      Alert.alert('Error', 'Por favor añade al menos una foto del terreno.');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Por favor registra la ubicación del terreno.');
      return;
    }

    if (!agreementChecked) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      // Mostrar indicador de carga
      setIsLoadingLocation(true);

      // Preparar los datos para enviar a la API
      const cropData = {
        // Generar un ID único para este cultivo
        cropId: `crop-${Date.now()}`,
        userId: "user123", // Este ID debería venir de tu sistema de autenticación
        name: terrainData.cultivo,
        cropType: terrainData.cultivo,
        plantDate: new Date().toISOString().split('T')[0],
        location: `${location.coords.latitude},${location.coords.longitude}`,
        area: parseFloat(terrainData.hectareas) + (parseFloat(terrainData.metros || '0') / 10000),
        notes: terrainData.descripcion || '',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Enviando datos del cultivo:', cropData);

      // Llamar a la API para crear el cultivo
      const response = await cropService.createCrop(cropData);
      console.log('Cultivo creado exitosamente:', response.data);

      // Mostrar panel de resultado exitoso
      Alert.alert(
        'Registro exitoso',
        'Tu terreno ha sido registrado correctamente. Los detalles se han guardado en el sistema.',
        [
          {
            text: 'Ver mis cultivos',
            onPress: () => {
              try {
                // @ts-ignore - Ignorar errores de tipos de TypeScript
                router.navigate({
                  pathname: "/(tabs)/cultivos"
                });
              } catch (error) {
                console.error('Error al navegar:', error);
                router.back();
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error al registrar el terreno:', error);
      Alert.alert(
        'Error',
        'Hubo un problema al registrar tu terreno. Por favor intenta de nuevo más tarde.'
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registro de Terreno</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Instructional section */}
        <View style={styles.infoSection}>
          <Info size={20} color={COLOR_PRIMARY} />
          <Text style={styles.infoText}>
            Para continuar con tu solicitud de financiamiento, necesitamos información sobre tu terreno.
          </Text>
        </View>
        
        {/* Measurement section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dimensiones del terreno</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Hectáreas</Text>
            <TextInput
              style={styles.input}
              value={terrainData.hectareas}
              onChangeText={(text) => handleInputChange('hectareas', text)}
              placeholder="Ej. 5"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Metros cuadrados adicionales</Text>
            <TextInput
              style={styles.input}
              value={terrainData.metros}
              onChangeText={(text) => handleInputChange('metros', text)}
              placeholder="Ej. 2500"
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de cultivo (opcional)</Text>
            <TextInput
              style={styles.input}
              value={terrainData.cultivo}
              onChangeText={(text) => handleInputChange('cultivo', text)}
              placeholder="Ej. Maíz, frijol, café"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descripción (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={terrainData.descripcion}
              onChangeText={(text) => handleInputChange('descripcion', text)}
              placeholder="Describe brevemente tu terreno, acceso al agua, etc."
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>
        
        {/* Photo section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotografías del terreno</Text>
          <Text style={styles.sectionDescription}>
            Agrega fotos que muestren claramente los límites y características de tu terreno.
          </Text>
          
          <View style={styles.photoButtons}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonOutline]} 
              onPress={takePhoto}
            >
              <Camera size={20} color={COLOR_PRIMARY} />
              <Text style={styles.buttonOutlineText}>Tomar foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.buttonOutline]} 
              onPress={pickImage}
            >
              <Upload size={20} color={COLOR_PRIMARY} />
              <Text style={styles.buttonOutlineText}>Subir fotos</Text>
            </TouchableOpacity>
          </View>
          
          {photos.length > 0 && (
            <View style={styles.photoGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image 
                    source={{ uri: photo.uri }} 
                    style={styles.photo}
                  />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Location section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ubicación GPS</Text>
          <Text style={styles.sectionDescription}>
            Registra la ubicación exacta de tu terreno. Es importante que te encuentres físicamente en el terreno al momento de registrar la ubicación.
          </Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonOutline, isLoadingLocation && styles.buttonDisabled]} 
            onPress={getLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? (
              <ActivityIndicator size="small" color={COLOR_PRIMARY} />
            ) : (
              <>
                <MapPin size={20} color={COLOR_PRIMARY} />
                <Text style={styles.buttonOutlineText}>
                  {location ? 'Actualizar ubicación' : 'Obtener ubicación GPS'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          {location && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                Latitud: {location.coords.latitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Longitud: {location.coords.longitude.toFixed(6)}
              </Text>
              <Text style={styles.locationText}>
                Precisión: ±{location.coords.accuracy?.toFixed(2) || "0"} metros
              </Text>
            </View>
          )}
        </View>
        
        {/* Documents section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documentos legales</Text>
          <Text style={styles.sectionDescription}>
            Sube escrituras de propiedad u otros documentos que acrediten la propiedad del terreno.
          </Text>
          
          <TouchableOpacity 
            style={[styles.button, styles.buttonOutline]} 
            onPress={pickDocument}
          >
            <FileText size={20} color={COLOR_PRIMARY} />
            <Text style={styles.buttonOutlineText}>Seleccionar documentos</Text>
          </TouchableOpacity>
          
          {documents.length > 0 && (
            <View style={styles.documentList}>
              {documents.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <FileText size={20} color={COLOR_GRAY} />
                  <Text style={styles.documentName} numberOfLines={1} ellipsizeMode="middle">
                    {doc.name}
                  </Text>
                  <TouchableOpacity 
                    style={styles.removeDocButton}
                    onPress={() => removeDocument(index)}
                  >
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Legal agreement section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acuerdo legal</Text>
          
          <TouchableOpacity 
            style={styles.agreementRow}
            onPress={() => setAgreementChecked(!agreementChecked)}
          >
            <View style={[
              styles.checkbox, 
              agreementChecked ? styles.checkboxChecked : {}
            ]}>
              {agreementChecked && <Check size={16} color="#fff" />}
            </View>
            <Text style={styles.agreementText}>
              Declaro que soy el propietario legítimo del terreno y acepto que este sea utilizado como garantía para el financiamiento solicitado. Comprendo las implicaciones legales y financieras de este acuerdo.
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Submit button */}
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.buttonPrimary,
            (!agreementChecked || !terrainData.hectareas || !terrainData.metros || !location || photos.length === 0 || documents.length === 0) && styles.buttonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={!agreementChecked || !terrainData.hectareas || !terrainData.metros || !location || photos.length === 0 || documents.length === 0}
        >
          <Text style={styles.buttonPrimaryText}>Registrar terreno</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR_PRIMARY,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLOR_PRIMARY,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#E6F7EF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: COLOR_PRIMARY,
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.light.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLOR_TEXT_SECONDARY,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR_BORDER_LIGHT,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    width: '31%', // Approximately 3 per row with gap
    aspectRatio: 1,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLOR_ERROR,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationInfo: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  documentList: {
    marginTop: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  removeDocButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLOR_ERROR,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLOR_PRIMARY,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLOR_PRIMARY,
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: COLOR_PRIMARY,
    marginTop: 20,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: COLOR_PRIMARY,
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: COLOR_PRIMARY,
    fontWeight: '500',
  }
}); 