import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { Camera } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

// Color constants
const COLOR_PRIMARY = Colors.light.tint;
const COLOR_GRAY = Colors.light.icon;

export default function CameraIconTest() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Camera Icon Test</Text>
      
      <View style={styles.iconRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.label}>Default Camera</Text>
          <Camera />
        </View>
        
        <View style={styles.iconContainer}>
          <Text style={styles.label}>Colored Camera (Primary)</Text>
          <Camera color={COLOR_PRIMARY} />
        </View>
      </View>
      
      <View style={styles.iconRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.label}>Colored Camera (Gray)</Text>
          <Camera color={COLOR_GRAY} />
        </View>
        
        <View style={styles.iconContainer}>
          <Text style={styles.label}>Sized Camera</Text>
          <Camera size={48} color={COLOR_PRIMARY} />
        </View>
      </View>
      
      <View style={styles.iconRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.label}>With Background</Text>
          <View style={styles.takePhotoButtonIconBg}>
            <Camera size={24} color={COLOR_PRIMARY} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 30,
    justifyContent: 'space-around',
  },
  iconContainer: {
    alignItems: 'center',
  },
  label: {
    marginBottom: 10,
    color: '#666',
  },
  takePhotoButtonIconBg: {
    backgroundColor: Colors.light.tint, // Use tint directly
    padding: 12, // p-3
    borderRadius: 999, // rounded-full
  },
}); 