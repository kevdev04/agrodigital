import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

// Color constants
const COLOR_PRIMARY = Colors.light.tint;

export default function CultivosScreen() {
  const router = useRouter();
  
  // Simulated user data
  const userData = {
    crops: [
      { name: "Maíz", area: "12 hectáreas", status: "En crecimiento", health: 85 },
      { name: "Frijol", area: "5 hectáreas", status: "Recién plantado", health: 90 }
    ],
    weatherAlerts: [
      { type: "Sequía moderada", region: "Norte", probability: "70%", impact: "Medio" },
      { type: "Lluvia intensa", region: "Sur", probability: "40%", impact: "Alto" }
    ]
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Cultivos</Text>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Crop Cards */}
        {userData.crops.map((crop, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cropHeader}>
              <Text style={styles.cropName}>{crop.name}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{crop.status}</Text>
              </View>
            </View>
            
            <View style={styles.cropDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Área</Text>
                <Text style={styles.detailValue}>{crop.area}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Salud</Text>
                <View style={styles.healthBar}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${crop.health}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.healthText}>{crop.health}%</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="camera" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Monitorear</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.statisticsButton]}>
                <Feather name="bar-chart-2" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Estadísticas</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        {/* Register New Crop */}
        <TouchableOpacity 
          style={styles.registerCard}
          onPress={() => router.push('/screens/RegistroTerrenoScreen')}
        >
          <Feather name="plus-circle" size={40} color="#9ca3af" />
          <Text style={styles.registerTitle}>Solicitar Financiamiento</Text>
          <Text style={styles.registerSubtitle}>Añade información sobre tu nuevo cultivo</Text>
        </TouchableOpacity>
        
        {/* Weather Alerts */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alertas Climáticas</Text>
          
          {userData.weatherAlerts.map((alert, index) => (
            <View key={index} style={styles.alertItem}>
              <View style={[
                styles.alertIcon, 
                alert.type.includes("Sequía") ? styles.sunIcon : styles.rainIcon
              ]}>
                <Feather 
                  name={alert.type.includes("Sequía") ? "sun" : "cloud-rain"} 
                  size={20} 
                  color={alert.type.includes("Sequía") ? "#dc2626" : "#3b82f6"} 
                />
              </View>
              
              <View style={styles.alertDetails}>
                <Text style={styles.alertTitle}>{alert.type}</Text>
                <Text style={styles.alertRegion}>Región: {alert.region}</Text>
                <View style={styles.alertMetrics}>
                  <Text style={styles.alertMetric}>Probabilidad: {alert.probability}</Text>
                  <Text style={styles.alertMetric}>Impacto: {alert.impact}</Text>
                </View>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllButtonText}>Ver todas las alertas</Text>
          </TouchableOpacity>
        </View>
        
        {/* Recommendations */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recomendaciones</Text>
          
          <View style={styles.recommendationItem}>
            <View style={styles.recommendationIcon}>
              <Feather name="droplet" size={20} color="#059669" />
            </View>
            
            <View style={styles.recommendationDetails}>
              <Text style={styles.recommendationTitle}>Optimización de riego</Text>
              <Text style={styles.recommendationDescription}>
                Reducir riego en 20% por alerta de sequía
              </Text>
            </View>
          </View>
          
          <View style={[styles.recommendationItem, styles.lastItem]}>
            <View style={[styles.recommendationIcon, styles.blueIcon]}>
              <Feather name="file-text" size={20} color="#2563eb" />
            </View>
            
            <View style={styles.recommendationDetails}>
              <Text style={styles.recommendationTitle}>Contrato de seguro</Text>
              <Text style={styles.recommendationDescription}>
                Asegura tu cosecha ante riesgos climáticos
              </Text>
            </View>
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
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
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    color: COLOR_PRIMARY,
    fontWeight: '500',
  },
  cropDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  healthBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 4,
  },
  healthText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_PRIMARY,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  statisticsButton: {
    backgroundColor: '#3b82f6',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
  },
  registerCard: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  registerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 4,
  },
  registerSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.light.text,
  },
  alertItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastItem: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sunIcon: {
    backgroundColor: '#fee2e2',
  },
  rainIcon: {
    backgroundColor: '#dbeafe',
  },
  alertDetails: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  alertRegion: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 4,
  },
  alertMetrics: {
    flexDirection: 'row',
  },
  alertMetric: {
    fontSize: 14,
    color: Colors.light.icon,
    marginRight: 12,
  },
  seeAllButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  seeAllButtonText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  recommendationItem: {
    flexDirection: 'row',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  blueIcon: {
    backgroundColor: '#dbeafe',
  },
  recommendationDetails: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  recommendationDescription: {
    fontSize: 14,
    color: Colors.light.icon,
  },
}); 