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
import { useRouter } from 'expo-router';
import { Auth } from 'aws-amplify';

// Color constants
const COLOR_PRIMARY = Colors.light.tint;
const COLOR_ERROR = '#DC3545';
const COLOR_ERROR_BACKGROUND = '#FEE2E2';
const COLOR_ERROR_BORDER = '#FCA5A5';
const COLOR_BORDER = '#E5E7EB';
const COLOR_TEXT_SECONDARY = Colors.light.icon;

export default function IniciarSesionScreen() {
  const router = useRouter();
  
  // State for form fields and validation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form validation
  const validateForm = () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return false;
    }
    
    // Simple email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      setError('Por favor ingresa un correo electrónico válido.');
      return false;
    }
    
    if (!password) {
      setError('Por favor ingresa tu contraseña.');
      return false;
    }
    
    return true;
  };
  
  // Handle login with Amplify
  const handleLogin = async () => {
    Keyboard.dismiss();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      try {
        // Sign in with Amplify Auth Gen 1
        const user = await Auth.signIn(email.trim(), password);
        
        if (user) {
          // Check if user needs to complete additional challenges
          if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
            // Navigate to SMS verification screen
            router.push({
              pathname: '/screens/VerificacionSMSScreen' as any,
              params: {
                phone: user.challengeParam?.phone || '',
                fullName: email.trim(),
                isSignUp: 'false'
              }
            });
          } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
            // Handle new password required scenario
            router.push('/screens/CambiarContrasenaScreen' as any);
          } else {
            // User is successfully signed in, navigate to main app
            router.push('/');
          }
        }
      } catch (authError: any) {
        console.error('Error durante la autenticación:', authError);
        
        // Check if this is a network error and we're in dev mode
        if (authError.message && authError.message.includes('Network error')) {
          // For development only - simulate success to test the UI flow
          if (__DEV__) {
            console.log('DEV MODE: Simulating successful login');
            
            // Just navigate to main app for testing
            router.push('/');
          } else {
            setError('Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.');
          }
        } else {
          throw authError; // Re-throw to be caught by the outer catch
        }
      }
    } catch (err: any) {
      // Handle specific error types
      const errorMessage = err.message || 'Error al iniciar sesión. Por favor intenta nuevamente.';
      
      if (errorMessage.includes('Incorrect username or password')) {
        setError('Credenciales incorrectas. Por favor verifica e intenta nuevamente.');
      } else if (errorMessage.includes('User does not exist')) {
        setError('Usuario no encontrado. Por favor verifica tu correo electrónico.');
      } else if (errorMessage.includes('User is not confirmed')) {
        // Handle unconfirmed user
        setError('Tu cuenta no ha sido confirmada. Por favor verifica tu correo electrónico.');
        // Optionally, navigate to confirmation screen
      } else {
        setError(errorMessage);
      }
      
      console.error('Error de inicio de sesión:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle forgot password
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico para restablecer la contraseña.');
      return;
    }
    
    // Simple email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Gen 1 syntax for forgot password
      await Auth.forgotPassword(email.trim());
      
      Alert.alert(
        "Código enviado",
        `Se ha enviado un código de verificación a tu correo electrónico.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to reset password confirmation screen
              router.push({
                pathname: '/screens/ResetPasswordScreen' as any,
                params: { email: email.trim() }
              });
            },
          },
        ]
      );
    } catch (err: any) {
      const errorMessage = err.message || 'Error al restablecer la contraseña. Por favor intenta nuevamente.';
      setError(errorMessage);
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
              <Text style={styles.loadingText}>Iniciando sesión...</Text>
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
              Iniciar Sesión
            </ThemedText>
          </View>
          
          {/* Main content */}
          <View style={styles.formContainer}>
            <View style={styles.formInnerContainer}>
              <ThemedText type="subtitle" style={styles.formTitle}>
                Bienvenido de vuelta
              </ThemedText>
              
              <Text style={styles.formDescription}>
                Ingresa tus credenciales para acceder a tu cuenta.
              </Text>
              
              {/* Email input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Mail size={20} color={COLOR_TEXT_SECONDARY} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor={COLOR_TEXT_SECONDARY}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
              
              {/* Password input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <Lock size={20} color={COLOR_TEXT_SECONDARY} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor={COLOR_TEXT_SECONDARY}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
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
              
              {/* Forgot password */}
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                disabled={isLoading}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
              
              {/* Error message */}
              {error ? (
                <View style={styles.errorContainer}>
                  <AlertCircle size={20} color={COLOR_ERROR} style={styles.errorIcon} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
              
              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton, 
                  isLoading && styles.submitButtonDisabled
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? ['#bdc3c7', '#a1a8ad'] : [COLOR_PRIMARY, COLOR_PRIMARY]}
                  style={styles.submitButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.submitButtonText}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.footerText}>
              ¿No tienes una cuenta?{' '}
              <Text 
                style={styles.registerLink} 
                onPress={() => router.push('/screens/RegistroUsuarioScreen' as any)}
              >
                Regístrate aquí
              </Text>
            </Text>
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
    height: 240, // Further increased
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
    paddingBottom: 30, // Increased for more space at bottom of header
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 70, // Matched with header paddingTop
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
    paddingTop: 30, // Increased internal padding
    marginTop: 40, // Increased for more space
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
  visibilityToggle: {
    paddingHorizontal: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: COLOR_PRIMARY,
    fontSize: 14,
    fontWeight: '500',
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
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLOR_TEXT_SECONDARY,
  },
  registerLink: {
    color: COLOR_PRIMARY,
    fontWeight: '500',
  },
}); 