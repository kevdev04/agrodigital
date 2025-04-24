import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Auth } from 'aws-amplify';

// Color constants
const COLOR_PRIMARY = Colors.light.tint;
const COLOR_ERROR = '#DC3545';
const COLOR_ERROR_BACKGROUND = '#FEE2E2';
const COLOR_ERROR_BORDER = '#FCA5A5';
const COLOR_BORDER = '#E5E7EB';
const COLOR_TEXT_SECONDARY = Colors.light.icon;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email || '';
  
  // State for form fields and validation
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form validation
  const validateForm = () => {
    if (!code.trim()) {
      setError('Por favor ingresa el código de verificación.');
      return false;
    }
    
    if (!newPassword) {
      setError('Por favor ingresa tu nueva contraseña.');
      return false;
    }
    
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    
    return true;
  };
  
  // Handle password reset confirmation
  const handleResetPassword = async () => {
    Keyboard.dismiss();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // For Gen 1, use forgotPasswordSubmit for this step
      await Auth.forgotPasswordSubmit(
        email,
        code,
        newPassword
      );
      
      Alert.alert(
        "Contraseña restablecida",
        "Tu contraseña ha sido restablecida exitosamente.",
        [
          {
            text: "Iniciar sesión",
            onPress: () => {
              router.replace('/screens/IniciarSesionScreen' as any);
            },
          },
        ]
      );
    } catch (err: any) {
      const errorMessage = err.message || 'Error al restablecer la contraseña. Por favor intenta nuevamente.';
      
      if (errorMessage.includes('Invalid verification code')) {
        setError('Código de verificación inválido. Por favor verifica e intenta nuevamente.');
      } else {
        setError(errorMessage);
      }
      
      console.error('Error al restablecer la contraseña:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Go back function
  const handleGoBack = () => {
    router.back();
  };

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
          {/* Loading overlay */}
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
              Restablecer Contraseña
            </ThemedText>
          </View>
          
          {/* Main content */}
          <View style={styles.formContainer}>
            <View style={styles.formInnerContainer}>
              <ThemedText type="subtitle" style={styles.formTitle}>
                Crear nueva contraseña
              </ThemedText>
              
              <Text style={styles.formDescription}>
                Ingresa el código de verificación enviado a tu correo electrónico y crea una nueva contraseña.
              </Text>
              
              {/* Email (readonly) */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Mail size={20} color={COLOR_TEXT_SECONDARY} />
                </View>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={email}
                  editable={false}
                />
              </View>
              
              {/* Verification code input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Código de verificación"
                  placeholderTextColor={COLOR_TEXT_SECONDARY}
                  value={code}
                  onChangeText={(text) => {
                    setCode(text);
                    setError('');
                  }}
                  keyboardType="number-pad"
                  editable={!isLoading}
                />
              </View>
              
              {/* New password input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Lock size={20} color={COLOR_TEXT_SECONDARY} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nueva contraseña"
                  placeholderTextColor={COLOR_TEXT_SECONDARY}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setError('');
                  }}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.visibilityToggle}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={COLOR_TEXT_SECONDARY} />
                  ) : (
                    <Eye size={20} color={COLOR_TEXT_SECONDARY} />
                  )}
                </TouchableOpacity>
              </View>
              
              {/* Confirm password input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Lock size={20} color={COLOR_TEXT_SECONDARY} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar contraseña"
                  placeholderTextColor={COLOR_TEXT_SECONDARY}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setError('');
                  }}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
              </View>
              
              {/* Error message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <AlertCircle size={20} color={COLOR_ERROR} style={styles.errorIcon} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              {/* Reset Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton, 
                  isLoading && styles.submitButtonDisabled
                ]}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? ['#bdc3c7', '#a1a8ad'] : [COLOR_PRIMARY, COLOR_PRIMARY]}
                  style={styles.submitButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Procesando...' : 'Restablecer Contraseña'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

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
    height: 240,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLOR_PRIMARY,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 16,
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
    width: '100%',
  },
  formContainer: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 30,
    marginTop: 40,
  },
  formInnerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 20,
    color: Colors.light.text,
  },
  formDescription: {
    textAlign: 'center',
    marginBottom: 24,
    color: COLOR_TEXT_SECONDARY,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR_BORDER,
    borderRadius: 8,
    marginBottom: 16,
    height: 56,
  },
  inputIconContainer: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.light.text,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: COLOR_TEXT_SECONDARY,
  },
  visibilityToggle: {
    paddingHorizontal: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 24,
    padding: 12,
    backgroundColor: COLOR_ERROR_BACKGROUND,
    borderWidth: 1,
    borderColor: COLOR_ERROR_BORDER,
    borderRadius: 8,
  },
  errorIcon: {
    marginTop: 1,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: COLOR_ERROR,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
}); 