import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  CreditCard,
  ClipboardList,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

// --- Constants for colors not defined in Colors.ts or needing specific shades ---
const COLOR_GRAY = Colors.light.icon; // Use existing gray for icons/placeholders
const COLOR_PRIMARY = Colors.light.tint; // Green from Colors.ts
const COLOR_ERROR = '#DC3545'; // Standard red for errors
const COLOR_ORANGE = '#F97316'; // Standard orange
const COLOR_BLUE = '#2563EB'; // Standard blue
const COLOR_BLUE_DARK = '#1D4ED8';
const COLOR_BLUE_LIGHT_BG = '#EFF6FF';
const COLOR_TEXT_SECONDARY = Colors.light.icon; // Use icon gray for secondary text
const COLOR_BORDER_LIGHT = '#E5E7EB'; // Light gray for borders
// --- End Constants ---

// Helper component for info rows in the header
const HeaderInfoRow = ({ label, value, valueColor }: { label: string; value: string | number; valueColor?: string }) => (
    <View style={styles.headerInfoRow}>
      <Text style={styles.headerInfoLabel}>{label}</Text>
      <Text style={[styles.headerInfoValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
);

// Helper component for info rows in cards
const InfoRow = ({ label, value, valueColor }: { label: string; value: string | number; valueColor?: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
);

export default function HistorialScreen() {
  const router = useRouter();
  // Simulación de datos que vendrían de vuestro formulario previo
  const [userData] = useState({
    nombre: 'María González Rodríguez',
    curp: 'GORM850612MDFNDR09',
    rfc: 'GORM850612RT5',
    fechaNacimiento: '12/06/1985',
    ingresosMensuales: '$28,500',
    tiempoEmpleoActual: '3 años, 4 meses',
    direccion: 'Av. Reforma 247, Col. Juárez, CDMX',
    telefono: '(55) 8732-4590',
    correo: 'maria.gonzalez@ejemplo.com',
  });

  // Resultado de la evaluación basado en el diagrama de flujo
  const [evaluationResult] = useState({
    tieneHistorial: true,
    historialFavorable: true,
    puntajeCrediticio: 720,
    flujoComproble: true,
    resultado: 'eligible', // "eligible", "not-eligible", "limited", "error"
    limiteCredito: '$120,000',
    tasaInteres: '12.5%',
    plazoMaximo: '48 meses',
  });

  // Función para determinar título y color basado en el resultado
  const getResultDisplay = () => {
    switch (evaluationResult.resultado) {
      case 'eligible':
        return {
          icon: <CheckCircle size={36} color="#fff" />,
          bgColor: COLOR_PRIMARY,
          title: '¡Aprobado!',
          subtitle: 'Elegible para financiamiento completo',
          textColor: COLOR_PRIMARY,
        };
      case 'not-eligible':
        return {
          icon: <XCircle size={36} color="#fff" />,
          bgColor: COLOR_ERROR,
          title: 'No Elegible',
          subtitle: 'Su historial crediticio no cumple con los requisitos',
          textColor: COLOR_ERROR,
        };
      case 'limited':
        return {
          icon: <AlertCircle size={36} color="#fff" />,
          bgColor: COLOR_ORANGE,
          title: 'Financiamiento Limitado',
          subtitle: 'Acceso restringido a opciones de crédito',
          textColor: COLOR_ORANGE,
        };
      case 'error':
        return {
          icon: <AlertCircle size={36} color="#fff" />,
          bgColor: COLOR_ERROR,
          title: 'Error de Validación',
          subtitle: 'Se requiere soporte con IA',
          textColor: COLOR_ERROR,
        };
      default:
        return {
          icon: <AlertCircle size={36} color="#fff" />,
          bgColor: COLOR_GRAY,
          title: 'En Proceso',
          subtitle: 'Evaluación en curso',
          textColor: COLOR_GRAY,
        };
    }
  };

  const resultDisplay = getResultDisplay();

  const getScoreColor = (score: number) => {
      if (score > 650) return '#fff'; // White for contrast on colored background
      if (score > 550) return '#fff';
      return '#fff'; // Keep text white in header
  }

  const handleDownload = () => {
      Alert.alert("Descargar PDF", "Funcionalidad no implementada.");
  };

  const handleContinue = () => {
      // Navigate to the next step: Terrain Registration
      router.push('../screens/RegistroTerrenoScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
        {/* Header con resultado principal y evaluación crediticia */}
        <View style={[styles.header, { backgroundColor: resultDisplay.bgColor }]}>
          {/* --- Top Part (Icon, Title, Subtitle) --- */}
          <View style={styles.headerIconContainer}>
            <View style={styles.headerIconBackground}>
              {resultDisplay.icon}
            </View>
            <View>
              <Text style={styles.headerTitle}>{resultDisplay.title}</Text>
              <Text style={styles.headerSubtitle}>{resultDisplay.subtitle}</Text>
            </View>
          </View>

          {/* --- Moved Credit Evaluation Details --- */}
          <View style={styles.headerCreditDetailsContainer}>
             <HeaderInfoRow
                label="Historial crediticio:"
                value={evaluationResult.tieneHistorial ? 'Sí cuenta' : 'No cuenta'}
                valueColor={'#fff'} // White text for contrast
             />

              {evaluationResult.tieneHistorial ? (
                <>
                  <HeaderInfoRow
                    label="Historial favorable:"
                    value={evaluationResult.historialFavorable ? 'Sí' : 'No'}
                    valueColor={'#fff'}
                  />
                  <HeaderInfoRow
                    label="Puntaje crediticio:"
                    value={evaluationResult.puntajeCrediticio}
                    valueColor={getScoreColor(evaluationResult.puntajeCrediticio)}
                  />
                </>
              ) : (
                <HeaderInfoRow
                  label="Flujo de caja comprobable:"
                  value={evaluationResult.flujoComproble ? 'Sí' : 'No'}
                  valueColor={evaluationResult.flujoComproble ? '#fff' : '#FFD2D2'} // Slightly different white/red for boolean in header
                />
              )}
          </View>

          {/* --- Removed original credit details container --- */}
          {/* {evaluationResult.resultado === 'eligible' && ( ... )} */}

        </View>

        {/* Main Content Area */}
        <View style={styles.contentArea}>
          {/* Datos personales Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <User size={20} color={COLOR_GRAY} />
              <Text style={styles.cardTitle}>Datos personales</Text>
            </View>
            <View style={styles.cardContent}>
              <InfoRow label="Nombre completo" value={userData.nombre} />
              <InfoRow label="CURP" value={userData.curp} />
              <InfoRow label="RFC" value={userData.rfc} />
              <InfoRow label="Fecha de nacimiento" value={userData.fechaNacimiento} />
              <InfoRow label="Teléfono" value={userData.telefono} />
            </View>
          </View>

          {/* Información financiera Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <CreditCard size={20} color={COLOR_GRAY} />
              <Text style={styles.cardTitle}>Información financiera</Text>
            </View>
            <View style={styles.cardContent}>
              <InfoRow label="Ingresos mensuales" value={userData.ingresosMensuales} />
              <InfoRow label="Tiempo en empleo actual" value={userData.tiempoEmpleoActual} />
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleDownload}>
              <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Descargar PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={handleContinue}>
              <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  header: {
    padding: 24, // p-6
    borderBottomLeftRadius: 24, // rounded-b-3xl
    borderBottomRightRadius: 24,
    // Removed shadow as it might interfere visually with content inside
    // elevation: 5,
  },
  headerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // gap-3
    marginBottom: 20, // Increased margin to separate from details below
  },
  headerIconBackground: {
    padding: 8, // p-2
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999, // rounded-full
  },
  headerTitle: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    color: '#fff',
    opacity: 0.9,
  },
  // --- Renamed and adjusted style for credit details inside header ---
  headerCreditDetailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8, // rounded-lg
    paddingVertical: 8, // Reduced vertical padding
    paddingHorizontal: 12, // p-3
    marginTop: 8, // mt-2 - Add some space from title block
  },
  // --- New styles for InfoRow within the header ---
  headerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4, // Reduced padding for header rows
  },
  headerInfoLabel: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
  },
  headerInfoValue: {
    fontWeight: 'bold', // Make value bold in header
    fontSize: 14,
    color: '#fff',
  },
  // --- Original InfoRow styles for cards below ---
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8, // pb-2
    marginBottom: 8, // for space-y-3 approximation
    borderBottomWidth: 1,
    borderBottomColor: COLOR_BORDER_LIGHT,
  },
  infoRowLast: {
      borderBottomWidth: 0,
      marginBottom: 0,
  },
  infoLabel: {
    color: COLOR_TEXT_SECONDARY, // text-gray-500
    fontSize: 14,
  },
  infoValue: {
    fontWeight: '500', // font-medium
    fontSize: 14,
    color: Colors.light.text,
  },
  // --- Styles for content below header ---
  contentArea: {
    padding: 16, // p-4
    marginTop: -16, // Pull content slightly up over the header radius
    zIndex: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12, // rounded-xl
    padding: 20, // p-5
    marginBottom: 16, // mb-4
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // gap-2
    marginBottom: 16, // mb-4
  },
  cardTitle: {
    fontSize: 18, // text-lg
    fontWeight: '600', // font-semibold
    color: Colors.light.text,
  },
  cardContent: {
      // space-y-3 is approximated by marginBottom in InfoRow
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12, // gap-3
    marginTop: 24, // mt-6
  },
  button: {
    flex: 1,
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded-lg
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLOR_PRIMARY,
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: COLOR_PRIMARY,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: '500', // font-medium
    fontSize: 16,
  },
  buttonTextPrimary: {
    color: '#fff',
  },
  buttonTextSecondary: {
    color: COLOR_PRIMARY,
  },
}); 