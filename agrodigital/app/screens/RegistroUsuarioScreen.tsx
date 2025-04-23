import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert, // Use Alert for simple notifications
  Platform,
  Modal,
  FlatList,
  ActivityIndicator, // Import ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronRight,
  Camera,
  Calendar,
  MapPin,
  User,
  Phone,
  Check,
  Info,
  AlertCircle,
  Mic, // Using Mic icon for voice assistant
  CheckSquare, // Example for Checkbox checked
  Square, // Example for Checkbox unchecked
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router'; // Import useRouter
import { Audio } from 'expo-av'; // Import Audio from expo-av
import { userService } from '../../api/userService';

// --- Constants for colors not defined in Colors.ts ---
const COLOR_GRAY = Colors.light.icon; // Use existing gray for icons/placeholders
const COLOR_PRIMARY = Colors.light.tint;
const COLOR_BORDER = '#E5E7EB'; // Light gray for borders
const COLOR_ERROR = '#DC3545'; // Standard red for errors
const COLOR_ERROR_BACKGROUND = '#FEE2E2'; // Light red background
const COLOR_ERROR_BORDER = '#FCA5A5'; // Medium red border
const COLOR_TEXT_SECONDARY = Colors.light.icon; // Use icon gray for secondary text
// --- End Constants ---

// Define types for our form data (File type doesn't directly map, use object or string for now)
interface FormData {
  fullName: string;
  phone: string;
  address: string;
  birthState: string;
  birthDate: string;
  gender: string;
  inePhoto: { uri: string | null } | null; // Use object for image data
}

interface InputFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  maxLength?: number;
  required?: boolean;
  hint?: string;
}

function InputField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  keyboardType = 'default',
  maxLength,
  required = true,
  hint,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  const handleHint = () => {
      if (hint) {
        Alert.alert('Información', hint);
      }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>
          {label}
          {required && <Text style={styles.requiredAsterisk}>*</Text>}
        </Text>
        {hint && (
          <TouchableOpacity onPress={handleHint} style={styles.hintButton}>
            <Info size={16} color={COLOR_GRAY} />
          </TouchableOpacity>
        )}
      </View>
      <View style={[
          styles.inputWrapper,
          focused ? styles.inputWrapperFocused : styles.inputWrapperBlurred,
      ]}>
        <View style={styles.iconWrapper}>{icon}</View>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={COLOR_GRAY}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          // secureTextEntry={type === 'password'} // Add if needed
        />
        {value ? (
          <View style={styles.checkWrapper}>
            <Check size={18} color={COLOR_PRIMARY} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  hint?: string;
}

function SelectField({
  label,
  icon,
  value,
  options,
  onChange,
  placeholder,
  required = true,
  hint,
}: SelectFieldProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleHint = () => {
      if (hint) {
        Alert.alert('Información', hint);
      }
  };

  const selectedOption = options.find(option => option.value === value);

  const renderItem = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={[styles.optionItem, value === item.value && styles.optionItemSelected]}
      onPress={() => {
        onChange(item.value);
        setModalVisible(false);
      }}>
      <Text style={[styles.optionText, value === item.value && styles.optionTextSelected]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>
          {label}
          {required && <Text style={styles.requiredAsterisk}>*</Text>}
        </Text>
        {hint && (
          <TouchableOpacity onPress={handleHint} style={styles.hintButton}>
            <Info size={16} color={COLOR_GRAY} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.inputWrapper, styles.inputWrapperBlurred]} // Apply blurred style always for select trigger
        onPress={() => setModalVisible(true)}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <View style={styles.chevronWrapper}>
          <ChevronRight size={20} color={COLOR_GRAY} />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar {label}</Text>
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={item => item.value}
              style={styles.optionsList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function RegistroUsuarioScreen() {
  const router = useRouter(); // Initialize router
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    address: '',
    birthState: '',
    birthDate: '',
    gender: '',
    inePhoto: null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleChange = (field: keyof FormData, value: string | { uri: string | null } | null) => {
     // Type assertion needed because state setter expects specific value types
     if (field === 'inePhoto') {
        setFormData({ ...formData, [field]: value as { uri: string | null } | null });
     } else {
        setFormData({ ...formData, [field]: value as string });
     }
  };

  const handlePhotoCapture = async () => {
    // Placeholder: In a real app, use expo-image-picker
    Alert.alert("Simulación", "Aquí se abriría la cámara o galería.");
    // Simulate picking an image
    const mockPhoto = { uri: 'https://via.placeholder.com/300x200.png?text=INE+Placeholder' };
    setPhotoPreview(mockPhoto.uri);
    handleChange('inePhoto', mockPhoto);

    /* --- Example using expo-image-picker (needs installation and permissions) ---
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoPreview(result.assets[0].uri);
      handleChange('inePhoto', { uri: result.assets[0].uri });
    }
    */
  };

  const handleSubmit = async () => {
    // Hide previous error messages
    setShowErrorMessage(false);
    // Start loading
    setIsLoading(true);

    // Validate form
    const requiredFields: Array<keyof FormData> = ['fullName', 'phone', 'address', 'birthState', 'birthDate', 'gender', 'inePhoto'];
    const isFilled = requiredFields.every(field => Boolean(formData[field]));

    try {
      if (isFilled && agreedToTerms) {
        console.log("Preparando datos para registro:", formData);
        
        // Crear objeto con los datos del usuario para enviar a la API
        const userData = {
          userId: `user-${Date.now()}`,  // Generar un ID único
          fullName: formData.fullName,
          email: `${formData.fullName.replace(/\s+/g, '').toLowerCase()}@ejemplo.com`, // Email provisional
          password: "Password123!", // Contraseña provisional
          phone: formData.phone,
          address: formData.address,
          birthState: formData.birthState,
          birthDate: formData.birthDate,
          gender: formData.gender,
          createdAt: new Date().toISOString()
        };
        
        console.log("Enviando datos de usuario:", userData);
        
        // Llamar a la API para registrar el usuario
        const response = await userService.register(userData);
        console.log("Usuario registrado exitosamente:", response.data);
        
        // Preparar la navegación a la pantalla de éxito con los datos del usuario
        try {
          // @ts-ignore - Ignorar errores de tipo en la navegación
          router.navigate({
            pathname: "/screens/RegistroExitosoScreen",
            params: {
              fullName: formData.fullName,
              phone: formData.phone,
              address: formData.address,
              birthState: formData.birthState,
              birthDate: formData.birthDate,
              gender: formData.gender
            }
          });
        } catch (error) {
          console.error("Error en navegación:", error);
          
          // Como alternativa, navegar directamente a las pestañas
          // @ts-ignore
          router.replace("/(tabs)");
        }
      } else {
        setShowErrorMessage(true);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al registrar tu perfil. Por favor intenta de nuevo más tarde."
      );
      setShowErrorMessage(true);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const states: SelectOption[] = [
    { value: 'Aguascalientes', label: 'Aguascalientes' },
    { value: 'Baja California', label: 'Baja California' },
    { value: 'Baja California Sur', label: 'Baja California Sur' },
    { value: 'Campeche', label: 'Campeche' },
    { value: 'Chiapas', label: 'Chiapas' },
    { value: 'Chihuahua', label: 'Chihuahua' },
    { value: 'Coahuila', label: 'Coahuila' },
    { value: 'Colima', label: 'Colima' },
    { value: 'Durango', label: 'Durango' },
    { value: 'Guanajuato', label: 'Guanajuato' },
    { value: 'Guerrero', label: 'Guerrero' },
    { value: 'Hidalgo', label: 'Hidalgo' },
    { value: 'Jalisco', label: 'Jalisco' },
    { value: 'Ciudad de México', label: 'Ciudad de México' },
    { value: 'Michoacán', label: 'Michoacán' },
    { value: 'Morelos', label: 'Morelos' },
    { value: 'Nayarit', label: 'Nayarit' },
    { value: 'Nuevo León', label: 'Nuevo León' },
    { value: 'Oaxaca', label: 'Oaxaca' },
    { value: 'Puebla', label: 'Puebla' },
    { value: 'Querétaro', label: 'Querétaro' },
    { value: 'Quintana Roo', label: 'Quintana Roo' },
    { value: 'San Luis Potosí', label: 'San Luis Potosí' },
    { value: 'Sinaloa', label: 'Sinaloa' },
    { value: 'Sonora', label: 'Sonora' },
    { value: 'Tabasco', label: 'Tabasco' },
    { value: 'Tamaulipas', label: 'Tamaulipas' },
    { value: 'Tlaxcala', label: 'Tlaxcala' },
    { value: 'Veracruz', label: 'Veracruz' },
    { value: 'Yucatán', label: 'Yucatán' },
    { value: 'Zacatecas', label: 'Zacatecas' },
  ];

  const genderOptions: SelectOption[] = [
    { value: 'Hombre', label: 'Hombre' },
    { value: 'Mujer', label: 'Mujer' },
  ];

  const playInstructions = async () => {
    // Stop any currently playing sound
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }

    try {
      // If not currently playing, create and play a new sound
      if (!isPlaying) {
        setIsPlaying(true);
        
        // Show loading indicator or status message
        Alert.alert('Instrucciones de voz', 'Reproduciendo instrucciones de registro...');
        
        // Create and load the sound object
        const { sound: newSound } = await Audio.Sound.createAsync(
          require('@/assets/audio/instrucciones-registro.mp3'),
          { shouldPlay: true, volume: 1.0 }
        );
        
        setSound(newSound);
        
        // When playback finishes
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'No se pudieron reproducir las instrucciones de audio.');
      setIsPlaying(false);
    }
  };

  // Clean up sound resources when component unmounts
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const readAloud = (text: string) => {
    // We'll keep this function for compatibility but use our new audio player
    playInstructions();
  };

  const handleTermsLink = () => {
      Alert.alert('Términos y Condiciones', 'Aquí se mostrarían los Términos y Condiciones.');
      // Could open a modal or navigate to a new screen
  }

  const handlePrivacyLink = () => {
      Alert.alert('Aviso de Privacidad', 'Aquí se mostraría el Aviso de Privacidad.');
       // Could open a modal or navigate to a new screen
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled" // Close keyboard on tap outside
      >

        {/* --- Loading Overlay --- */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLOR_PRIMARY} />
            <Text style={styles.loadingText}>Procesando...</Text>
          </View>
        )}

        {/* Header with gradient */}
        <LinearGradient
          colors={[COLOR_PRIMARY, COLOR_PRIMARY]} // Using tint twice for now, adjust if a darker shade is added
          style={styles.header}>
          <TouchableOpacity
            style={styles.voiceAssistantButton}
            onPress={playInstructions}>
            <Text style={styles.voiceAssistantText}>
              {isPlaying ? 'Detener instrucciones' : 'Activar instrucciones por voz'}
            </Text>
            <Mic size={20} color="#fff" style={styles.voiceAssistantIcon} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>
            Registro de Agricultor
          </ThemedText>
        </LinearGradient>

        {/* Main form */}
        <View style={styles.formContainer}>
          <View style={styles.formInnerContainer}>
            <ThemedText type="subtitle" style={styles.formSectionTitle}>
              Información Personal
            </ThemedText>

            <InputField
              label="Nombre Completo"
              icon={<User size={20} color={COLOR_GRAY} />}
              value={formData.fullName}
              onChange={(value) => handleChange('fullName', value)}
              placeholder="Escribe tu nombre y apellidos"
              hint="Ingresa tu nombre como aparece en tu INE/IFE"
            />

            <InputField
              label="Número de Teléfono"
              icon={<Phone size={20} color={COLOR_GRAY} />}
              value={formData.phone}
              onChange={(value) => handleChange('phone', value)}
              placeholder="10 dígitos"
              keyboardType="phone-pad"
              maxLength={10}
              hint="Número donde podamos contactarte"
            />

            <InputField
              label="Dirección"
              icon={<MapPin size={20} color={COLOR_GRAY} />}
              value={formData.address}
              onChange={(value) => handleChange('address', value)}
              placeholder="Calle, número, colonia, ciudad"
              hint="Dirección donde vives actualmente"
            />

            <SelectField
              label="Estado de Nacimiento"
              icon={<MapPin size={20} color={COLOR_GRAY} />}
              value={formData.birthState}
              options={states}
              onChange={(value) => handleChange('birthState', value)}
              placeholder="Selecciona tu estado"
              hint="Estado donde naciste según tu acta de nacimiento"
            />

            <InputField
              label="Fecha de Nacimiento"
              icon={<Calendar size={20} color={COLOR_GRAY} />}
              value={formData.birthDate}
              onChange={(value) => handleChange('birthDate', value)}
              placeholder="DD/MM/AAAA"
              hint="Formato: día/mes/año completo"
              // Consider using a Date Picker component here
            />

            <SelectField
              label="Sexo"
              icon={<User size={20} color={COLOR_GRAY} />}
              value={formData.gender}
              options={genderOptions}
              onChange={(value) => handleChange('gender', value)}
              placeholder="Selecciona una opción"
            />

            {/* INE Photo Section */}
            <View style={styles.inputContainer}>
                 <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>
                    Credencial INE
                    <Text style={styles.requiredAsterisk}>*</Text>
                    </Text>
                    <TouchableOpacity
                        onPress={() => Alert.alert('Info INE', 'Toma una foto clara del frente de tu credencial de elector')}
                        style={styles.hintButton}>
                        <Info size={16} color={COLOR_GRAY} />
                    </TouchableOpacity>
                </View>

                {photoPreview ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image
                      source={{ uri: photoPreview }}
                      style={styles.photoPreviewImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.retakePhotoButton}
                      onPress={!isLoading ? handlePhotoCapture : undefined} // Disable if loading
                      disabled={isLoading}>
                      <Camera size={20} color={isLoading ? COLOR_GRAY : COLOR_PRIMARY} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.takePhotoButton}
                    onPress={!isLoading ? handlePhotoCapture : undefined} // Disable if loading
                    disabled={isLoading}>
                    <View style={styles.takePhotoButtonIconBg}>
                      <Camera size={24} color={isLoading ? COLOR_GRAY : COLOR_PRIMARY} />
                    </View>
                    <Text style={[styles.takePhotoButtonText, isLoading && styles.disabledText]}>Tomar foto de INE</Text>
                    <Text style={[styles.takePhotoButtonHint, isLoading && styles.disabledText]}>
                      Asegúrate de que todos los datos sean legibles
                    </Text>
                  </TouchableOpacity>
                )}
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => !isLoading && setAgreedToTerms(!agreedToTerms)} // Disable if loading
                disabled={isLoading}>
                {agreedToTerms ? (
                  <CheckSquare size={24} color={isLoading ? COLOR_GRAY : COLOR_PRIMARY} />
                ) : (
                  <Square size={24} color={COLOR_GRAY} />
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                Al crear una cuenta, acepto los{' '}
                <Text style={[styles.linkText, isLoading && styles.disabledText]} onPress={!isLoading ? handleTermsLink : undefined}>
                  Términos y Condiciones
                </Text>{' '}
                y el{' '}
                <Text style={[styles.linkText, isLoading && styles.disabledText]} onPress={!isLoading ? handlePrivacyLink : undefined}>
                  Aviso de Privacidad
                </Text>{' '}
                del servicio.
              </Text>
            </View>

            {/* Error Message */}
            {showErrorMessage && (
              <View style={styles.errorContainer}>
                <AlertCircle size={20} color={COLOR_ERROR} style={styles.errorIcon} />
                <Text style={styles.errorText}>
                  Por favor completa todos los campos requeridos y acepta los términos y condiciones.
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}>
                <LinearGradient
                    colors={isLoading ? ['#bdc3c7', '#a1a8ad'] : [COLOR_PRIMARY, COLOR_PRIMARY]}
                    style={styles.submitButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}>
                        <Text style={styles.submitButtonText}>
                          {isLoading ? 'Procesando...' : 'Completar Registro'}
                        </Text>
                        {!isLoading && <Check size={20} color="#fff" style={styles.submitButtonIcon}/>}
                </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            Tus datos están protegidos y solo serán utilizados para los fines específicos de este programa. Si necesitas ayuda, llama al 800-123-4567.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Define styles (This is a significant translation from Tailwind)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
      paddingBottom: 40, // Ensure space at the bottom
  },
  // --- Loading Overlay Styles --- 
  loadingOverlay: {
      ...StyleSheet.absoluteFillObject, // Cover entire screen
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000, // Ensure it's on top
  },
  loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: COLOR_PRIMARY,
      fontWeight: '500',
  },
  // --- End Loading Overlay Styles --- 
  header: {
    paddingTop: 30, // Adjust as needed for status bar height
    paddingBottom: 40, // Increased padding below header content
    paddingHorizontal: 16,
    alignItems: 'center', // Center items horizontally
  },
  voiceAssistantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 20, // Space below the button
  },
  voiceAssistantText: {
    color: '#fff',
    marginRight: 8,
    fontWeight: '500',
  },
  voiceAssistantIcon: {
      // marginLeft added automatically by space in Text component
  },
  headerTitle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    marginTop: -24, // Pull the form container up slightly over the header bottom
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24, // Match rounded-t-3xl
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24, // Add padding inside the container
    zIndex: 10,
  },
  formInnerContainer: {
    backgroundColor: '#fff', // White card background
    borderRadius: 12, // Match rounded-xl
    padding: 20, // Match p-6
    marginBottom: 24, // Match mb-6
    // Shadow (adjust for platform differences)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formSectionTitle: {
    marginBottom: 16,
    fontWeight: '500', // font-medium
    color: Colors.light.text,
  },
  inputContainer: {
    marginBottom: 24, // Match mb-6
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Match mb-2
  },
  labelText: {
    color: COLOR_TEXT_SECONDARY,
    fontWeight: '500', // font-medium
    flexDirection: 'row', // To allow asterisk next to text
    alignItems: 'center',
  },
  requiredAsterisk: {
    color: COLOR_ERROR,
    marginLeft: 4,
  },
  hintButton: {
    padding: 4, // Make it easier to tap
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12, // Match rounded-xl
    borderWidth: 1, // Start with 1px border
    overflow: 'hidden', // Ensure content respects border radius
  },
  inputWrapperBlurred: {
      borderColor: COLOR_BORDER,
  },
  inputWrapperFocused: {
    borderColor: COLOR_PRIMARY,
    // Add shadow matching shadow-md if needed (use platform-specific shadow props)
    shadowColor: COLOR_PRIMARY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // For Android
  },
  iconWrapper: {
    paddingHorizontal: 12, // Match p-3 roughly
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    paddingVertical: 12, // Match p-3 roughly
    paddingRight: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  checkWrapper: {
    paddingHorizontal: 8, // Match p-2
  },
  selectText: {
      flex: 1,
      paddingVertical: 12,
      paddingRight: 12,
      fontSize: 16,
      color: Colors.light.text,
  },
  selectPlaceholder: {
      color: COLOR_GRAY,
  },
  chevronWrapper: {
      paddingHorizontal: 12,
  },
  modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end', // Position modal at bottom
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      maxHeight: '70%', // Limit modal height
      flexGrow: 1, // Add flexGrow to help content expand
  },
  modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
      color: Colors.light.text,
  },
  optionsList: {
      marginBottom: 15,
      flex: 1,
  },
  optionItem: {
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: COLOR_BORDER,
  },
  optionItemSelected: {
      backgroundColor: Colors.light.tint, // Use tint directly for light green
  },
  optionText: {
      fontSize: 16,
      color: Colors.light.text,
  },
  optionTextSelected: {
      color: COLOR_PRIMARY,
      fontWeight: '500',
  },
  closeButton: {
      backgroundColor: COLOR_PRIMARY,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
  },
  closeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
  takePhotoButton: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 24, // Match p-6
      backgroundColor: '#fff',
      borderWidth: 1, // Dashed border isn't directly supported, use solid
      borderStyle: 'dashed', // Note: Dashed might only work well on iOS
      borderColor: COLOR_BORDER,
      borderRadius: 12, // rounded-xl
  },
  takePhotoButtonIconBg: {
      backgroundColor: Colors.light.tint, // Use tint directly
      padding: 12, // p-3
      borderRadius: 999, // rounded-full
  },
  takePhotoButtonText: {
      color: COLOR_PRIMARY,
      fontWeight: '500', // font-medium
      fontSize: 16,
  },
  takePhotoButtonHint: {
      fontSize: 12, // text-sm
      color: COLOR_TEXT_SECONDARY,
      textAlign: 'center',
  },
  photoPreviewContainer: {
      position: 'relative', // Needed for absolute positioning of button
  },
  photoPreviewImage: {
      width: '100%',
      height: 192, // Match h-48
      borderRadius: 12, // rounded-xl
      borderWidth: 1, // border-2 (use 1 or 2)
      borderColor: COLOR_PRIMARY,
  },
  retakePhotoButton: {
      position: 'absolute',
      bottom: 12, // bottom-3
      right: 12, // right-3
      backgroundColor: '#fff',
      borderRadius: 999, // rounded-full
      padding: 8, // p-2
      // Add shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the top
    marginBottom: 24, // mb-6
    gap: 12, // Match gap-3
  },
  checkboxContainer: {
    paddingTop: 2, // Align checkbox slightly better with text start
  },
  termsText: {
    flex: 1, // Allow text to wrap
    fontSize: 14, // text-sm
    color: COLOR_TEXT_SECONDARY,
    lineHeight: 20, // Improve readability
  },
  linkText: {
    color: COLOR_PRIMARY,
    fontWeight: '500', // font-medium
  },
  disabledText: { // Style for disabled text/links
      opacity: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align icon with start of text
    gap: 8, // gap-2
    marginBottom: 24, // mb-6
    padding: 12, // p-3
    backgroundColor: COLOR_ERROR_BACKGROUND,
    borderWidth: 1,
    borderColor: COLOR_ERROR_BORDER,
    borderRadius: 8, // rounded-lg
  },
  errorIcon: {
    marginTop: 1, // mt-0.5 approximation
  },
  errorText: {
    flex: 1, // Allow text wrap
    fontSize: 14, // text-sm
    color: COLOR_ERROR,
  },
  submitButton: {
      borderRadius: 12, // rounded-xl
      overflow: 'hidden', // Clip gradient to border radius
      // Add shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
  },
  submitButtonDisabled: { // Style for disabled button
    opacity: 0.6,
  },
  submitButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16, // Match py-4
      width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500', // font-medium
    fontSize: 16,
    marginRight: 8, // mr-2
  },
  submitButtonIcon: {
    // Icon spacing handled by marginRight on text
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12, // text-xs
    color: COLOR_TEXT_SECONDARY,
    paddingHorizontal: 24, // px-6
    marginTop: 16, // Add some space above footer text
  },
}); 