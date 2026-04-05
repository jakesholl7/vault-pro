import { ethers } from 'ethers';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useVault } from '../contexts/VaultContext';
import { networks } from '../config/networks';

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { showCalculator, currentNetwork, isWatchOnly } = useVault();

  const provider = new ethers.JsonRpcProvider(networks[currentNetwork].rpc);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBalance(address);
    setRefreshing(false);
  }, [loadBalance, address]);

  useEffect(() => {
    loadWallet();
  }, [loadWallet]);

  const loadWallet = useCallback(async () => {
    try {
      const privateKey = await SecureStore.getItemAsync('privateKey');
      if (!privateKey) {
        const newWallet = ethers.Wallet.createRandom();
        await SecureStore.setItemAsync('privateKey', newWallet.privateKey);
        setAddress(newWallet.address);
        await loadBalance(newWallet.address);
      } else {
        const loadedWallet = new ethers.Wallet(privateKey, provider);
        setAddress(loadedWallet.address);
        await loadBalance(loadedWallet.address);
      }
    } catch {
      Alert.alert('Error', 'Failed to load wallet');
    }
  }, [provider, loadBalance]);

  const loadBalance = useCallback(async (addr: string) => {
    if (isWatchOnly) {
      setBalance('0');
      return;
    }
    try {
      const bal = await provider.getBalance(addr);
      setBalance(ethers.formatEther(bal));
    } catch (error) {
      console.error(error);
    }
  }, [provider, isWatchOnly]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Web3 Wallet</Text>
      <Text style={styles.network}>Network: {networks[currentNetwork].name}</Text>
      <Text style={styles.balance}>Balance: {balance} {networks[currentNetwork].nativeCurrency}</Text>
      <Text style={styles.address}>Address: {address}</Text>
      {isWatchOnly && <Text style={styles.watchOnly}>Watch-Only Mode</Text>}
      <TouchableOpacity style={styles.button} onPress={showCalculator}>
        <Text style={styles.buttonText}>Open Calculator</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  network: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  balance: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  address: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  watchOnly: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Wallet;