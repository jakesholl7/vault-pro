import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CalculatorOverlay from '../../components/CalculatorOverlay';
import Wallet from '../../components/Wallet';
import { VaultProvider, useVault } from '../../contexts/VaultContext';

const AppContent: React.FC = () => {
  const { isCalculatorVisible, isUnlocked } = useVault();

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
