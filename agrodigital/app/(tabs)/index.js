import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../contexts/UserContext';

// Color constants
const COLOR_PRIMARY = Colors.light.tint;

export default function HomeScreen() {
  const [offlineMode, setOfflineMode] = useState(false);
  const { userData } = useUser();
  
  // Simulated user data
  const userDataDefault = {
    name: userData.fullName || "Miguel Rodríguez",
    cooperative: "Cooperativa San Juan",
    currentCredit: 52000,
    availableCredit: 78000,
    creditScore: 720,
    harvestProgress: 65,
    crops: [
      { name: "Maíz", area: "12 hectáreas", status: "En crecimiento", health: 85 },
      { name: "Frijol", area: "5 hectáreas", status: "Recién plantado", health: 90 }
    ],
    upcomingPayments: [
      { concept: "Crédito de fertilizantes", amount: 12000, dueDate: "20/05/2025" },
      { concept: "Financiamiento de equipo", amount: 8500, dueDate: "15/06/2025" }
    ],
    weatherAlerts: [
      { type: "Sequía moderada", region: "Norte", probability: "70%", impact: "Medio" },
      { type: "Lluvia intensa", region: "Sur", probability: "40%", impact: "Alto" }
    ]
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Bienvenido,</Text>
          <Text style={styles.userName}>{userDataDefault.name}</Text>
          <Text style={styles.cooperativeText}>{userDataDefault.cooperative}</Text>
        </View>
        
        <View style={[
          styles.connectionBadge, 
          offlineMode ? styles.offlineBadge : styles.onlineBadge
        ]}>
          <Feather 
            name="wifi" 
            size={16} 
            color={offlineMode ? "#f97316" : COLOR_PRIMARY} 
          />
          <Text style={[
            styles.connectionText,
            offlineMode ? styles.offlineText : styles.onlineText
          ]}>
            {offlineMode ? "Modo Offline" : "Conectado"}
          </Text>
        </View>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Financial Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estado Financiero</Text>
          
          <View style={styles.financialRow}>
            <View style={styles.financialItem}>
              <Text style={styles.itemLabel}>Crédito Disponible</Text>
              <Text style={styles.itemValue}>
                ${userDataDefault.availableCredit.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.financialItem}>
              <Text style={styles.itemLabel}>Crédito Actual</Text>
              <Text style={styles.itemValue}>
                ${userDataDefault.currentCredit.toLocaleString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.creditScoreContainer}>
            <Text style={styles.creditScoreLabel}>Score Crediticio</Text>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${userDataDefault.creditScore/10}%` }
                ]} 
              />
            </View>
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleText}>0</Text>
              <Text style={styles.scaleText}>1000</Text>
            </View>
          </View>
        </View>
        
        {/* Info Cards */}
        <View style={styles.infoCardsRow}>
          {/* Crops Card */}
          <View style={[styles.card, styles.halfCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Financiamientos</Text>
              <Feather name="leaf" size={20} color={COLOR_PRIMARY} />
            </View>
            
            <Text style={styles.highlightText}>2 Activos</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${userDataDefault.harvestProgress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                Progreso de cosecha: {userDataDefault.harvestProgress}%
              </Text>
            </View>
          </View>
          
          {/* Weather Card */}
          <View style={[styles.card, styles.halfCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Clima</Text>
              <Feather name="cloud" size={20} color="#3b82f6" />
            </View>
            
            <View style={styles.weatherInfo}>
              <Feather name="sun" size={24} color="#f59e0b" />
              <View style={styles.weatherDetails}>
                <Text style={styles.temperatureText}>26°C</Text>
                <Text style={styles.weatherCondition}>Soleado</Text>
              </View>
            </View>
            
            <View style={styles.alertRow}>
              <Feather name="shield" size={16} color="#dc2626" />
              <Text style={styles.alertText}>Alerta de sequía: 70%</Text>
            </View>
          </View>
        </View>
        
        {/* Upcoming Payments */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Próximos Pagos</Text>
          
          {userDataDefault.upcomingPayments.map((payment, index) => (
            <View key={index} style={styles.paymentItem}>
              <View>
                <Text style={styles.paymentConcept}>{payment.concept}</Text>
                <Text style={styles.paymentDate}>Vence: {payment.dueDate}</Text>
              </View>
              <Text style={styles.paymentAmount}>${payment.amount.toLocaleString()}</Text>
            </View>
          ))}
          
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Administrar Pagos</Text>
          </TouchableOpacity>
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
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  cooperativeText: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  onlineBadge: {
    backgroundColor: '#dcfce7',
  },
  offlineBadge: {
    backgroundColor: '#ffedd5',
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  onlineText: {
    color: COLOR_PRIMARY,
  },
  offlineText: {
    color: '#f97316',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: Colors.light.text,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  financialItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    width: '48%',
  },
  itemLabel: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  creditScoreContainer: {
    marginTop: 8,
  },
  creditScoreLabel: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 4,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scaleText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  infoCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfCard: {
    width: '48%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 12,
    color: Colors.light.icon,
    marginTop: 4,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherDetails: {
    marginLeft: 12,
  },
  temperatureText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  weatherCondition: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    fontSize: 12,
    color: '#dc2626',
    marginLeft: 4,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  paymentConcept: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  paymentDate: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  manageButton: {
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  manageButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
}); 