import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NoElegibleScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={[styles.content, styles.errorBackground]}>
        <ThemedText type="title" darkColor="white" lightColor="white">No Elegible</ThemedText>
        <ThemedText darkColor="white" lightColor="white">Lo sentimos, parece que no cumples con los requisitos en este momento.</ThemedText>
        {/* Add options like contacting support or trying again later */}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorBackground: {
    backgroundColor: '#DC3545', // A shade of red
  },
}); 