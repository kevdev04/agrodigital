import React, { useState, useEffect, useRef } from 'react';
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
  Linking,
  Dimensions, // Add Dimensions to get screen size
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronRight,
  ChevronLeft,
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
  X,
  Navigation,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router'; // Import useRouter
import { Audio } from 'expo-av'; // Import Audio from expo-av
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { useUser } from '@/contexts/UserContext';
import * as Location from 'expo-location'; // Import Location
import { authService } from '@/api/authService'; // Import the authService

const COLOR_GRAY = Colors.light.icon; 
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
  inePhotoFront: { uri: string | null } | null;
  inePhotoBack: { uri: string | null } | null; // Adding back photo
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
  numbersOnly?: boolean;
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
  numbersOnly = false,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleHint = () => {
      if (hint) {
        Alert.alert('Información', hint);
      }
  };

  const handleTextChange = (text: string) => {
    // If numbersOnly is true, filter out non-numeric characters
    if (numbersOnly) {
      const numericValue = text.replace(/[^0-9]/g, '');
      onChange(numericValue);
    } else {
      onChange(text);
    }
  };

  const handlePress = () => {
    inputRef.current?.focus();
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
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={[
          styles.inputWrapper,
          focused ? styles.inputWrapperFocused : styles.inputWrapperBlurred,
        ]}
      >
        <View style={styles.iconWrapper}>{icon}</View>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={COLOR_GRAY}
          keyboardType={numbersOnly ? 'numeric' : keyboardType}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {value ? (
          <View style={styles.checkWrapper}>
            <Check size={18} color={COLOR_PRIMARY} />
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

// New component for date input with DD/MM/YYYY format
interface DateInputFieldProps {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  hint?: string;
}

function DateInputField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  required = true,
  hint,
}: DateInputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  const dayRef = useRef<TextInput>(null);
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  // Update internal state when the value changes
  useEffect(() => {
    if (value) {
      const parts = value.split('/');
      if (parts.length === 3) {
        setDay(parts[0]);
        setMonth(parts[1]);
        setYear(parts[2]);
      }
    }
  }, []);

  const handleHint = () => {
    if (hint) {
      Alert.alert('Información', hint);
    }
  };

  const updateFormattedDate = (newDay: string, newMonth: string, newYear: string) => {
    const formattedDate = `${newDay}${newDay ? '/' : ''}${newMonth}${newMonth ? '/' : ''}${newYear}`;
    onChange(formattedDate.replace(/\/$/, '')); // Remove trailing slash if exists
  };

  const handleDayChange = (text: string) => {
    // Only allow digits
    const numericValue = text.replace(/[^0-9]/g, '');
    setDay(numericValue);
    
    if (numericValue.length === 2) {
      monthRef.current?.focus();
    }
    
    updateFormattedDate(numericValue, month, year);
  };

  const handleMonthChange = (text: string) => {
    // Only allow digits
    const numericValue = text.replace(/[^0-9]/g, '');
    setMonth(numericValue);
    
    if (numericValue.length === 2) {
      yearRef.current?.focus();
    }
    
    updateFormattedDate(day, numericValue, year);
  };

  const handleYearChange = (text: string) => {
    // Only allow digits
    const numericValue = text.replace(/[^0-9]/g, '');
    setYear(numericValue);
    updateFormattedDate(day, month, numericValue);
  };

  const handleDayKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Backspace' && day === '') {
      // No action needed, already at first field
    }
  };

  const handleMonthKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Backspace' && month === '') {
      dayRef.current?.focus();
    }
  };

  const handleYearKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Backspace' && year === '') {
      monthRef.current?.focus();
    }
  };

  const handlePress = () => {
    // Always focus on the day field first
    dayRef.current?.focus();
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
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        style={[
          styles.inputWrapper,
          focused ? styles.inputWrapperFocused : styles.inputWrapperBlurred,
        ]}
      >
        <View style={styles.iconWrapper}>{icon}</View>
        <View style={styles.dateInputContainer}>
          <TextInput
            ref={dayRef}
            style={styles.dateInput}
            value={day}
            onChangeText={handleDayChange}
            placeholder="DD"
            placeholderTextColor={COLOR_GRAY}
            keyboardType="numeric"
            maxLength={2}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyPress={handleDayKeyPress}
          />
          <Text style={styles.dateInputSeparator}>/</Text>
          <TextInput
            ref={monthRef}
            style={styles.dateInput}
            value={month}
            onChangeText={handleMonthChange}
            placeholder="MM"
            placeholderTextColor={COLOR_GRAY}
            keyboardType="numeric"
            maxLength={2}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyPress={handleMonthKeyPress}
          />
          <Text style={styles.dateInputSeparator}>/</Text>
          <TextInput
            ref={yearRef}
            style={styles.dateInput}
            value={year}
            onChangeText={handleYearChange}
            placeholder="AAAA"
            placeholderTextColor={COLOR_GRAY}
            keyboardType="numeric"
            maxLength={4}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyPress={handleYearKeyPress}
          />
        </View>
        {day && month && year && year.length === 4 ? (
          <View style={styles.checkWrapper}>
            <Check size={18} color={COLOR_PRIMARY} />
          </View>
        ) : null}
      </TouchableOpacity>
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
  const { updateUserData } = useUser(); // Get updateUserData from context
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    address: '',
    birthState: '',
    birthDate: '',
    gender: '',
    inePhotoFront: null,
    inePhotoBack: null, // Initialize back photo as null
  });
  const [photoPreviewFront, setPhotoPreviewFront] = useState<string | null>(null);
  const [photoPreviewBack, setPhotoPreviewBack] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [capturingFront, setCapturingFront] = useState(true); // Track which side we're capturing
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
      
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationStatus.status === 'granted');
    })();
  }, []);

  const handleChange = (field: keyof FormData, value: string | { uri: string | null } | null) => {
     // Type assertion needed because state setter expects specific value types
     if (field === 'inePhotoFront' || field === 'inePhotoBack') {
        setFormData({ ...formData, [field]: value as { uri: string | null } | null });
     } else {
        setFormData({ ...formData, [field]: value as string });
     }
  };

  const handlePhotoCapture = async (side: 'front' | 'back') => {
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
      // Set which side we're capturing
      setCapturingFront(side === 'front');
      
      // Launch the camera directly with ImagePicker
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        if (side === 'front') {
          setPhotoPreviewFront(result.assets[0].uri);
          handleChange('inePhotoFront', { uri: result.assets[0].uri });
        } else {
          setPhotoPreviewBack(result.assets[0].uri);
          handleChange('inePhotoBack', { uri: result.assets[0].uri });
        }
      }
    } catch (error) {
      console.error('Error capturando foto:', error);
      Alert.alert('Error', 'No se pudo tomar la foto.');
    }
  };

  // New function to get the user's current location
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

    try {
      setIsGettingLocation(true);

      // Get the user's current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      // Reverse geocode to get the address from coordinates
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode) {
        // Format the address
        const formattedAddress = [
          geocode.street,
          geocode.streetNumber,
          geocode.district,
          geocode.city,
          geocode.region,
          geocode.postalCode,
          geocode.country
        ]
          .filter(Boolean)
          .join(', ');

        // Set the address in the form
        handleChange('address', formattedAddress);
      } else {
        Alert.alert('Error', 'No se pudo obtener la dirección desde tu ubicación.');
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener tu ubicación.');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    // Hide previous error messages
    setShowErrorMessage(false);
    // Start loading
    setIsLoading(true);

    // Validate form
    const requiredFields: Array<keyof FormData> = ['fullName', 'phone', 'address', 'birthState', 'birthDate', 'gender', 'inePhotoFront', 'inePhotoBack'];
    const isFilled = requiredFields.every(field => Boolean(formData[field]));

    try {
      if (isFilled && agreedToTerms) {
        console.log("Preparando datos para registro:", formData);
        
        // Generate email from name
        const email = `${formData.fullName.replace(/\s+/g, '.').toLowerCase()}@agrodigital.com`;
        
        // Generate a unique username (non-email format) for Cognito
        const username = `user_${formData.phone}`;
        
        // Save user data to context
        updateUserData({
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          birthState: formData.birthState,
          birthDate: formData.birthDate,
          gender: formData.gender,
          email: email,
          username: username, // Store the non-email username
          // We'll generate CURP and RFC later in Historial.tsx
        });
        
        // Cognito registration (if enabled)
        if (process.env.EXPO_PUBLIC_USE_COGNITO === 'true') {
          try {
            // Generate a temporary password
            const tempPassword = Math.random().toString(36).slice(-8) + 'Aa1!';
            
            // Register user with Cognito
            await authService.register({
              username: username,
              password: tempPassword, // Will be changed by user later
              email: email,
              phone: formData.phone,
              fullName: formData.fullName,
              address: formData.address,
              birthState: formData.birthState,
              birthDate: formData.birthDate,
              gender: formData.gender
            });
            
            console.log("Usuario registrado en Cognito correctamente");
          } catch (error) {
            const cognitoError = error as { code?: string; message?: string };
            console.error("Error en registro con Cognito:", cognitoError);
            
            if (cognitoError.code === 'UsernameExistsException') {
              Alert.alert("Error", "Este usuario ya existe. Por favor inicia sesión o usa otro número de teléfono.");
              setIsLoading(false);
              return;
            }
            
            // For demo purposes, continue anyway
            console.log("Continuando el flujo para demostración...");
          }
        } else {
          // Wait a bit to simulate processing
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Navegar a la pantalla de verificación SMS
        try {
          router.push({
            pathname: "/screens/VerificacionSMSScreen",
            params: {
              phone: formData.phone,
              fullName: formData.fullName,
              address: formData.address,
              birthState: formData.birthState,
              birthDate: formData.birthDate,
              gender: formData.gender,
              username: username // Pass the username to the verification screen
            }
          });
        } catch (error) {
          console.error("Error en navegación:", error);
          
          // Como alternativa, navegar directamente a las pestañas
          router.replace("/(tabs)");
        }
      } else {
        setShowErrorMessage(true);
      }
    } catch (error) {
      console.error("Error en procesamiento:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al procesar tu información. Por favor intenta de nuevo."
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

  // Go back function
  const handleGoBack = () => {
    router.back();
  };

  // Reference object for input fields
  const inputRefs = useRef<{
    addressRef: TextInput | null;
  }>({
    addressRef: null,
  });

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={[COLOR_PRIMARY, COLOR_PRIMARY]}
        style={styles.headerBackground}
      />
      <SafeAreaView style={styles.safeArea} edges={['right', 'left', 'bottom']}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- Loading Overlay --- */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLOR_PRIMARY} />
              <Text style={styles.loadingText}>Procesando...</Text>
            </View>
          )}

          {/* Header with gradient */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleGoBack}
              disabled={isLoading}
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            
            <ThemedText type="title" style={styles.headerTitle}>
              Registro de Agricultor
            </ThemedText>
            
            <TouchableOpacity
              style={styles.voiceAssistantButton}
              onPress={playInstructions}>
              <Text style={styles.voiceAssistantText}>
                {isPlaying ? 'Detener instrucciones' : 'Activar instrucciones por voz'}
              </Text>
              <Mic size={20} color="#fff" style={styles.voiceAssistantIcon} />
            </TouchableOpacity>
          </View>

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
                numbersOnly={true}
              />

              {/* Modified Address input with location button */}
              <View style={styles.inputContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>
                    Dirección<Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TouchableOpacity onPress={() => Alert.alert('Información', 'Dirección donde vives actualmente')} style={styles.hintButton}>
                    <Info size={16} color={COLOR_GRAY} />
                  </TouchableOpacity>
                </View>
                <View style={styles.locationContainer}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      const addressInputRef = inputRefs.current?.addressRef;
                      if (addressInputRef) {
                        addressInputRef.focus();
                      }
                    }}
                    style={[
                      styles.inputWrapper,
                      styles.locationInput,
                      formData.address ? styles.inputWrapperFocused : styles.inputWrapperBlurred,
                    ]}
                  >
                    <View style={styles.iconWrapper}><MapPin size={20} color={COLOR_GRAY} /></View>
                    <TextInput
                      ref={(ref) => {
                        if (inputRefs.current) {
                          inputRefs.current.addressRef = ref;
                        }
                      }}
                      style={styles.textInput}
                      value={formData.address}
                      onChangeText={(value) => handleChange('address', value)}
                      placeholder="Calle, número, colonia, ciudad"
                      placeholderTextColor={COLOR_GRAY}
                    />
                    {formData.address ? (
                      <View style={styles.checkWrapper}>
                        <Check size={18} color={COLOR_PRIMARY} />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.locationButton,
                      isGettingLocation && styles.locationButtonDisabled
                    ]}
                    onPress={getLocation}
                    disabled={isGettingLocation || isLoading}
                  >
                    {isGettingLocation ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Navigation size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <SelectField
                label="Estado de Nacimiento"
                icon={<MapPin size={20} color={COLOR_GRAY} />}
                value={formData.birthState}
                options={states}
                onChange={(value) => handleChange('birthState', value)}
                placeholder="Selecciona tu estado"
                hint="Estado donde naciste según tu acta de nacimiento"
              />

              <DateInputField
                label="Fecha de Nacimiento"
                icon={<Calendar size={20} color={COLOR_GRAY} />}
                value={formData.birthDate}
                onChange={(value) => handleChange('birthDate', value)}
                placeholder="DD/MM/AAAA"
                hint="Formato: día/mes/año completo"
              />

              <SelectField
                label="Sexo"
                icon={<User size={20} color={COLOR_GRAY} />}
                value={formData.gender}
                options={genderOptions}
                onChange={(value) => handleChange('gender', value)}
                placeholder="Selecciona una opción"
              />

              {/* INE Photo Section - Updated for front and back */}
              <View style={styles.inputContainer}>
                

                {/* Front of INE */}
                <View style={styles.inePhotoContainer}>
                  <Text style={styles.inePhotoLabel}>Frente de la INE:<Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  {photoPreviewFront ? (
                    <View style={styles.photoPreviewContainer}>
                      <Image
                        source={{ uri: photoPreviewFront }}
                        style={styles.photoPreviewImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.retakePhotoButton}
                        onPress={() => !isLoading && handlePhotoCapture('front')}
                        disabled={isLoading}>
                        <Camera size={20} color="#000000" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.takePhotoButton}
                      onPress={() => !isLoading && handlePhotoCapture('front')}
                      disabled={isLoading}>
                      <View style={[styles.takePhotoButtonIconBg, { backgroundColor: '#e6f7ef' }]}>
                        <Camera size={24} color="#000000" strokeWidth={2} />
                      </View>
                      <Text style={[styles.takePhotoButtonText, isLoading && styles.disabledText]}>
                        Tomar foto del frente
                      </Text>
                      <Text style={[styles.takePhotoButtonHint, isLoading && styles.disabledText]}>
                        Asegúrate de que todos los datos sean legibles
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Back of INE */}
                <View style={[styles.inePhotoContainer, {marginTop: 16}]}>
                  <Text style={styles.inePhotoLabel}>Reverso de la INE:<Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  {photoPreviewBack ? (
                    <View style={styles.photoPreviewContainer}>
                      <Image
                        source={{ uri: photoPreviewBack }}
                        style={styles.photoPreviewImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.retakePhotoButton}
                        onPress={() => !isLoading && handlePhotoCapture('back')}
                        disabled={isLoading}>
                        <Camera size={20} color="#000000" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.takePhotoButton}
                      onPress={() => !isLoading && handlePhotoCapture('back')}
                      disabled={isLoading}>
                      <View style={[styles.takePhotoButtonIconBg, { backgroundColor: '#e6f7ef' }]}>
                        <Camera size={24} color="#000000" strokeWidth={2} />
                      </View>
                      <Text style={[styles.takePhotoButtonText, isLoading && styles.disabledText]}>
                        Tomar foto del reverso
                      </Text>
                      <Text style={[styles.takePhotoButtonHint, isLoading && styles.disabledText]}>
                        Asegúrate de que todos los datos sean legibles
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
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
    </View>
  );
}

// Define styles (This is a significant translation from Tailwind)
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220, // Adjust height as needed
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40, // Ensure space at the bottom
  },
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
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    paddingTop: 70,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 70,
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20, // Add margin to create space between title and button
  },
  voiceAssistantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 5, // Space above the button
  },
  voiceAssistantText: {
    color: '#fff',
    marginRight: 8,
    fontWeight: '500',
  },
  voiceAssistantIcon: {
      // marginLeft added automatically by space in Text component
  },
  formContainer: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24, // Match rounded-t-3xl
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24, // Add padding inside the container
    marginTop: 20, // Add margin to create space after header
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
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
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
  // Styles for the INE photo containers
  inePhotoContainer: {
    width: '100%',
  },
  inePhotoLabel: {
    fontSize: 14,
    color: COLOR_TEXT_SECONDARY,
    marginBottom: 8,
    fontWeight: '500',
  },
  dateInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
  dateInputSeparator: {
    fontSize: 16,
    color: COLOR_GRAY,
    paddingHorizontal: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationInput: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: COLOR_PRIMARY,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  locationButtonDisabled: {
    backgroundColor: COLOR_GRAY,
    opacity: 0.7,
  },
}); 