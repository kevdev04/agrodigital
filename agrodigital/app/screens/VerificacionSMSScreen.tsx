import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ChevronLeft,
  Check,
  AlertCircle,
  MessageSquare,
  Clock,
  RotateCw,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Color constants
const COLOR_PRIMARY = Colors.light.tint;
const COLOR_GRAY = Colors.light.icon;
const COLOR_ERROR = '#DC3545';
const COLOR_ERROR_BACKGROUND = '#FEE2E2';
const COLOR_ERROR_BORDER = '#FCA5A5';
const COLOR_BORDER = '#E5E7EB';
const COLOR_TEXT_SECONDARY = Colors.light.icon;

// SMS code verification screen
export default function VerificacionSMSScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Get phone number from params (if passed)
  const phoneNumber = params.phone ? String(params.phone) : '';
  
  // State for the code inputs
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Refs for the input fields to allow automatic focus
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);
  
  // Effect for countdown timer
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      
      return () => clearInterval(countdown);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timer, canResend]);
  
  // Handle input change for each digit
  const handleInputChange = (text: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(text)) return;
    
    // Update the code array
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    
    // If text is not empty and not last input, focus on next input
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };
  
  // Handle backspace key press
  const handleKeyPress = (e: any, index: number) => {
    // If backspace is pressed and current input is empty, focus on previous input
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Resend code function
  const handleResendCode = () => {
    if (!canResend) return;
    
    // Reset timer and canResend state
    setTimer(60);
    setCanResend(false);
    
    // Simulate sending a new code
    Alert.alert(
      'Código Reenviado',
      `Se ha enviado un nuevo código de verificación al número ${phoneNumber}.`
    );
  };
  
  // Verify code function
  const handleVerifyCode = async () => {
    Keyboard.dismiss();
    
    // Check if the code is complete
    if (code.some(digit => digit === '')) {
      setError('Por favor ingresa el código completo de 6 dígitos.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll use a fixed code "123456"
      const enteredCode = code.join('');
      if (enteredCode === '123456') {
        // Success! Navigate to the main app tabs
        router.replace("/(tabs)");
      } else {
        setError('Código incorrecto. Por favor verifica e intenta nuevamente.');
      }
    } catch (err) {
      setError('Error al verificar. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Go back function
  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Loading overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={COLOR_PRIMARY} />
            <Text style={styles.loadingText}>Verificando...</Text>
          </View>
        )}
        
        {/* Header with gradient */}
        <LinearGradient
          colors={[COLOR_PRIMARY, COLOR_PRIMARY]}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
            disabled={isLoading}
          >
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          
          <ThemedText type="title" style={styles.headerTitle}>
            Verificación por SMS
          </ThemedText>
        </LinearGradient>
        
        {/* Main content */}
        <View style={styles.formContainer}>
          <View style={styles.formInnerContainer}>
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <MessageSquare size={32} color={COLOR_PRIMARY} />
              </View>
            </View>
            
            <ThemedText type="subtitle" style={styles.formTitle}>
              Ingresa el código de verificación
            </ThemedText>
            
            <Text style={styles.formDescription}>
              Hemos enviado un código de 6 dígitos al número
              {phoneNumber ? ` ${phoneNumber}` : ' registrado'}.
              Por favor ingrésalo a continuación.
            </Text>
            
            {/* Code input fields */}
            <View style={styles.codeInputContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.codeInput,
                    digit ? styles.codeInputFilled : {},
                    error && styles.codeInputError
                  ]}
                  value={digit}
                  onChangeText={(text) => handleInputChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  editable={!isLoading}
                />
              ))}
            </View>
            
            {/* Error message */}
            {error ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={20} color={COLOR_ERROR} style={styles.errorIcon} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            {/* Resend code */}
            <View style={styles.resendContainer}>
              {!canResend ? (
                <View style={styles.timerContainer}>
                  <Clock size={16} color={COLOR_TEXT_SECONDARY} />
                  <Text style={styles.timerText}>
                    Reenviar código en {timer} segundos
                  </Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.resendButton} 
                  onPress={handleResendCode}
                  disabled={isLoading}
                >
                  <RotateCw size={16} color={COLOR_PRIMARY} />
                  <Text style={styles.resendText}>Reenviar código</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton, 
                isLoading && styles.submitButtonDisabled
              ]}
              onPress={handleVerifyCode}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#bdc3c7', '#a1a8ad'] : [COLOR_PRIMARY, COLOR_PRIMARY]}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Verificando...' : 'Verificar Código'}
                </Text>
                {!isLoading && <Check size={20} color="#fff" style={styles.submitButtonIcon}/>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.footerText}>
            ¿Necesitas ayuda? Comunícate a nuestro centro de atención al 800-123-4567
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 20,
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
  },
  formContainer: {
    flex: 1,
    marginTop: -24,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 24,
    zIndex: 10,
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 100, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
    fontSize: 18,
    color: Colors.light.text,
  },
  formDescription: {
    textAlign: 'center',
    marginBottom: 24,
    color: COLOR_TEXT_SECONDARY,
    lineHeight: 20,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeInput: {
    width: 45,
    height: 56,
    borderWidth: 1,
    borderColor: COLOR_BORDER,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  codeInputFilled: {
    borderColor: COLOR_PRIMARY,
    backgroundColor: 'rgba(0, 100, 0, 0.05)',
  },
  codeInputError: {
    borderColor: COLOR_ERROR,
    backgroundColor: 'rgba(220, 53, 69, 0.05)',
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
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerText: {
    fontSize: 14,
    color: COLOR_TEXT_SECONDARY,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  resendText: {
    fontSize: 14,
    color: COLOR_PRIMARY,
    fontWeight: '500',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    marginRight: 8,
  },
  submitButtonIcon: {
    // Icon spacing handled by marginRight on text
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLOR_TEXT_SECONDARY,
    paddingHorizontal: 24,
    marginTop: 16,
  },
}); 