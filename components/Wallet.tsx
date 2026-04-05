import { ethers } from 'ethers';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useVault } from '../contexts/VaultContext';

const RPC_URL = 'https://cloudflare-eth.com'; // Public Ethereum mainnet RPC
const provider = new ethers.JsonRpcProvider(RPC_URL);

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState('');
  const { showCalculator } = useVault();

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
  }, []);

  const loadBalance = async (addr: string) => {
    try {
      const bal = await provider.getBalance(addr);
      setBalance(ethers.formatEther(bal));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Web3 Wallet</Text>
      <Text style={styles.balance}>Balance: {balance} ETH</Text>
      <Text style={styles.address}>Address: {address}</Text>
      <TouchableOpacity style={styles.button} onPress={showCalculator}>
        <Text style={styles.buttonText}>Open Calculator</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  balance: {
    fontSize: 18,
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Wallet;