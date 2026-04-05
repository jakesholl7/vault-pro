import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import CalculatorOverlay from '../components/CalculatorOverlay';
import Wallet from '../components/Wallet';
import { VaultProvider, useVault } from '../contexts/VaultContext';

const AppContent: React.FC = () => {
  const { isCalculatorVisible, isUnlocked, showCalculator } = useVault();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' && isUnlocked && !isCalculatorVisible) {
        showCalculator();
      }
    });

    return () => subscription?.remove();
  }, [isUnlocked, isCalculatorVisible, showCalculator]);

  return (
    <View style={styles.container}>
      {isUnlocked && (
        <BlurView intensity={isCalculatorVisible ? 50 : 0} style={styles.blur}>
          <Wallet />
        </BlurView>
      )}
      <CalculatorOverlay />
    </View>
  );
};

export default function HomeScreen() {
  return (
    <VaultProvider>
      <AppContent />
    </VaultProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blur: {
    flex: 1,
  },
});