import React, { createContext, ReactNode, useContext, useState } from 'react';

interface VaultContextType {
  isCalculatorVisible: boolean;
  isUnlocked: boolean;
  showCalculator: () => void;
  hideCalculator: () => void;
  unlockWallet: () => void;
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

  const showCalculator = () => setIsCalculatorVisible(true);
  const hideCalculator = () => setIsCalculatorVisible(false);
  const unlockWallet = () => setIsUnlocked(true);

  return (
    <VaultContext.Provider
      value={{
        isCalculatorVisible,
        isUnlocked,
        showCalculator,
        hideCalculator,
        unlockWallet,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};