import React, { createContext, ReactNode, useContext, useState } from 'react';
import { networks, defaultNetwork } from '../config/networks';

interface VaultContextType {
  isCalculatorVisible: boolean;
  isUnlocked: boolean;
  isWatchOnly: boolean;
  currentNetwork: string;
  showCalculator: () => void;
  hideCalculator: () => void;
  unlockWallet: () => void;
  unlockWatchOnly: () => void;
  setNetwork: (network: string) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};

interface VaultProviderProps {
  children: ReactNode;
}

export const VaultProvider: React.FC<VaultProviderProps> = ({ children }) => {
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isWatchOnly, setIsWatchOnly] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(defaultNetwork);

  const showCalculator = () => setIsCalculatorVisible(true);
  const hideCalculator = () => setIsCalculatorVisible(false);
  const unlockWallet = () => {
    setIsUnlocked(true);
    setIsWatchOnly(false);
  };
  const unlockWatchOnly = () => {
    setIsUnlocked(true);
    setIsWatchOnly(true);
  };
  const setNetwork = (network: string) => setCurrentNetwork(network);

  return (
    <VaultContext.Provider
      value={{
        isCalculatorVisible,
        isUnlocked,
        isWatchOnly,
        currentNetwork,
        showCalculator,
        hideCalculator,
        unlockWallet,
        unlockWatchOnly,
        setNetwork,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};