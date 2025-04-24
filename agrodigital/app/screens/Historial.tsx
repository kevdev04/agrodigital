import React, { useState, useEffect, useRef } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUser } from '@/contexts/UserContext';

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

// --- Helper Functions for CURP/RFC Generation ---

// Normalize string: Uppercase, remove accents, handle Ñ
const normalizeString = (str: string): string => {
  if (!str) return '';
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/Ñ/g, 'X'); // Replace Ñ with X as per some rules
};

// Get first vowel of a string
const getFirstVowel = (str: string): string => {
  const match = normalizeString(str).match(/[AEIOU]/);
  return match ? match[0] : 'X'; // Use X if no vowel found
};

// Get first internal consonant
const getFirstInternalConsonant = (str: string): string => {
  const normalized = normalizeString(str);
  for (let i = 1; i < normalized.length; i++) {
    if ('BCDFGHJKLMNPQRSTVWXYZ'.includes(normalized[i])) {
      return normalized[i];
    }
  }
  return 'X'; // Use X if no internal consonant found
};

// Basic name parser (adjust based on expected format)
const parseFullName = (fullName: string): { first: string; paternal: string; maternal: string } => {
  const parts = normalizeString(fullName).split(' ').filter(part => part.length > 0);
  if (parts.length === 0) return { first: '', paternal: '', maternal: '' };

  let firstName = '';
  let paternalSurname = '';
  let maternalSurname = '';

  // Very basic assumption: First part is name(s), last two are surnames
  if (parts.length >= 3) {
    paternalSurname = parts[parts.length - 2];
    maternalSurname = parts[parts.length - 1];
    firstName = parts.slice(0, parts.length - 2).join(' ');
  } else if (parts.length === 2) {
    // Assume: First name, Paternal surname (no maternal)
    paternalSurname = parts[1];
    firstName = parts[0];
    maternalSurname = ''; // No maternal surname
  } else {
    // Assume: Only first name or single name part
    firstName = parts[0];
    paternalSurname = '';
    maternalSurname = '';
  }

  // Further filtering for common particles might be needed (DE, LA, DEL, etc.)

  return {
    first: firstName.split(' ')[0] || '', // Take only the first name part
    paternal: paternalSurname,
    maternal: maternalSurname,
  };
};

// Map state names to CURP codes
const stateCodes: { [key: string]: string } = {
  'AGUASCALIENTES': 'AS', 'BAJA CALIFORNIA': 'BC', 'BAJA CALIFORNIA SUR': 'BS',
  'CAMPECHE': 'CC', 'COAHUILA': 'CL', 'COLIMA': 'CM', 'CHIAPAS': 'CS',
  'CHIHUAHUA': 'CH', 'DISTRITO FEDERAL': 'DF', 'CIUDAD DE MÉXICO': 'DF',
  'DURANGO': 'DG', 'GUANAJUATO': 'GT', 'GUERRERO': 'GR', 'HIDALGO': 'HG',
  'JALISCO': 'JC', 'MÉXICO': 'MC', 'MICHOACÁN': 'MN', 'MORELOS': 'MS',
  'NAYARIT': 'NT', 'NUEVO LEÓN': 'NL', 'OAXACA': 'OC', 'PUEBLA': 'PL',
  'QUERÉTARO': 'QT', 'QUINTANA ROO': 'QR', 'SAN LUIS POTOSÍ': 'SP',
  'SINALOA': 'SL', 'SONORA': 'SR', 'TABASCO': 'TC', 'TAMAULIPAS': 'TS',
  'TLAXCALA': 'TL', 'VERACRUZ': 'VZ', 'YUCATÁN': 'YN', 'ZACATECAS': 'ZS',
  'NACIDO EN EL EXTRANJERO': 'NE'
};

const getStateCode = (stateName: string): string => {
  return stateCodes[normalizeString(stateName)] || 'NE'; // Default to NE (Foreign)
};

// Format birth date DD/MM/AAAA to YYMMDD
const formatBirthDate = (dateStr: string): string => {
  if (!dateStr || !/\d{2}\/\d{2}\/\d{4}/.test(dateStr)) return '000000';
  const [day, month, year] = dateStr.split('/');
  return `${year.substring(2)}${month}${day}`;
};

// Generate CURP base (first 16 chars)
const generateCurpBase = (name: { first: string; paternal: string; maternal: string }, birthDate: string, gender: string, stateCode: string): string => {
  const firstLetterPaternal = name.paternal ? normalizeString(name.paternal)[0] : 'X';
  const firstVowelPaternal = name.paternal ? getFirstVowel(name.paternal) : 'X';
  const firstLetterMaternal = name.maternal ? normalizeString(name.maternal)[0] : 'X';
  const firstLetterName = name.first ? normalizeString(name.first)[0] : 'X';
  const dateYYMMDD = formatBirthDate(birthDate);
  const genderChar = normalizeString(gender) === 'HOMBRE' ? 'H' : 'M';
  const firstConsonantPaternal = name.paternal ? getFirstInternalConsonant(name.paternal) : 'X';
  const firstConsonantMaternal = name.maternal ? getFirstInternalConsonant(name.maternal) : 'X';
  const firstConsonantName = name.first ? getFirstInternalConsonant(name.first) : 'X';

  // Handle potential invalid chars or edge cases like names starting with Ñ (becomes X)
  const base = `${firstLetterPaternal}${firstVowelPaternal}${firstLetterMaternal}${firstLetterName}${dateYYMMDD}${genderChar}${stateCode}${firstConsonantPaternal}${firstConsonantMaternal}${firstConsonantName}`;
  
  // Basic filtering for common inappropriate words (replace with X)
  const forbiddenWords = ['BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COJA', 'COJE', 'COJI', 'COJO', 'CULO', 'FETO', 'GUEY', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO', 'KOGE', 'KOJO', 'KAKA', 'KULO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MION', 'MOCO', 'MULA', 'PEDA', 'PEDO', 'PENE', 'PUTA', 'PUTO', 'QULO', 'RATA', 'RUIN'];
  const firstFour = base.substring(0, 4);
  if (forbiddenWords.includes(firstFour)) {
      return `X${base.substring(1, 16)}`;
  }

  return base.substring(0, 16);
};

// Generate RFC base (first 10 chars)
const generateRfcBase = (name: { first: string; paternal: string; maternal: string }, birthDate: string): string => {
  const firstLetterPaternal = name.paternal ? normalizeString(name.paternal)[0] : 'X';
  const firstVowelPaternal = name.paternal ? getFirstVowel(name.paternal) : 'X';
  const firstLetterMaternal = name.maternal ? normalizeString(name.maternal)[0] : 'X';
  const firstLetterName = name.first ? normalizeString(name.first)[0] : 'X';
  const dateYYMMDD = formatBirthDate(birthDate);

  const base = `${firstLetterPaternal}${firstVowelPaternal}${firstLetterMaternal}${firstLetterName}${dateYYMMDD}`;
  
  // Basic filtering for common inappropriate words (replace with X)
  const forbiddenWords = ['BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COJA', 'COJE', 'COJI', 'COJO', 'CULO', 'FETO', 'GUEY', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO', 'KOGE', 'KOJO', 'KAKA', 'KULO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MION', 'MOCO', 'MULA', 'PEDA', 'PEDO', 'PENE', 'PUTA', 'PUTO', 'QULO', 'RATA', 'RUIN'];
  const firstFour = base.substring(0, 4);
  if (forbiddenWords.includes(firstFour)) {
      return `X${base.substring(1, 10)}`;
  }

  return base.substring(0, 10);
};

// --- End Helper Functions ---

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
  const params = useLocalSearchParams();
  const { userData, updateUserData } = useUser();
  const hasUpdatedUserData = useRef(false);
  
  // Get user data from params (passed from RegistroUsuarioScreen through VerificacionSMSScreen)
  const fullName = params.fullName ? String(params.fullName) : '';
  const phone = params.phoneNumber ? String(params.phoneNumber) : '';
  const address = params.address ? String(params.address) : '';
  const birthState = params.birthState ? String(params.birthState) : '';
  const birthDate = params.birthDate ? String(params.birthDate) : '';
  const gender = params.gender ? String(params.gender) : '';
  
  // Generate CURP and RFC bases - store in refs to avoid recalculation on each render
  const curpBaseRef = useRef('');
  const rfcBaseRef = useRef('');
  
  // State for displaying CURP and RFC in UI
  const [displayCurp, setDisplayCurp] = useState('');
  const [displayRfc, setDisplayRfc] = useState('');
  
  // Only calculate once on component mount
  useEffect(() => {
    if (fullName && birthDate) {
      const parsedName = parseFullName(fullName);
      const stateCode = getStateCode(birthState);
      curpBaseRef.current = generateCurpBase(parsedName, birthDate, gender, stateCode);
      rfcBaseRef.current = generateRfcBase(parsedName, birthDate);
      
      // Update display values
      setDisplayCurp(`${curpBaseRef.current}XX`);
      setDisplayRfc(`${rfcBaseRef.current}XXX`);
    }
  }, []);
  
  // Save generated CURP and RFC to user context only once
  useEffect(() => {
    if (curpBaseRef.current && rfcBaseRef.current && !hasUpdatedUserData.current) {
      updateUserData({
        curp: `${curpBaseRef.current}XX`, // Placeholder XX for homoclave + digit
        rfc: `${rfcBaseRef.current}XXX`,  // Placeholder XXX for homoclave
      });
      hasUpdatedUserData.current = true;
    }
  }, [updateUserData]);

  // Simulación de datos con CURP y RFC generados (con homoclave placeholder)
  const [userData2] = useState(() => {
    // Use an initialization function to avoid recalculating on every render
    return {
      nombre: fullName || 'María González Rodríguez',
      curp: 'Calculando...', // Will be updated after calculation
      rfc: 'Calculando...', // Will be updated after calculation
      fechaNacimiento: birthDate || '12/06/1985',
      ingresosMensuales: '$28,500', // Placeholder
      tiempoEmpleoActual: '3 años, 4 meses', // Placeholder
      direccion: address || 'Av. Reforma 247, Col. Juárez, CDMX',
      telefono: phone || '(55) 8732-4590',
      correo: `${fullName.replace(/\s+/g, '.').toLowerCase()}@ejemplo.com` || 'maria.gonzalez@ejemplo.com',
      estado: birthState || 'Ciudad de México',
      genero: gender || 'Mujer',
    };
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
              <InfoRow label="Nombre completo" value={userData2.nombre} />
              <InfoRow label="CURP" value={displayCurp || 'XXXX000000XXXXXX'} />
              <InfoRow label="RFC" value={displayRfc || 'XXXX000000'} />
              <InfoRow label="Fecha de nacimiento" value={userData2.fechaNacimiento} />
              <InfoRow label="Estado" value={userData2.estado} />
              <InfoRow label="Género" value={userData2.genero} />
              <InfoRow label="Teléfono" value={userData2.telefono} />
              <InfoRow label="Correo" value={userData2.correo} />
            </View>
          </View>

          {/* Información financiera Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <CreditCard size={20} color={COLOR_GRAY} />
              <Text style={styles.cardTitle}>Información financiera</Text>
            </View>
            <View style={styles.cardContent}>
              <InfoRow label="Ingresos mensuales" value={userData2.ingresosMensuales} />
              <InfoRow label="Tiempo en empleo actual" value={userData2.tiempoEmpleoActual} />
              <InfoRow label="Dirección" value={userData2.direccion} />
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