'use client';

import { ReactNode, useEffect } from 'react';

import Header from '@/components/Header';

import BodyProvider from './BodyProvider';
import { ThemeProvider } from './ThemeProvider';
import { useContractStore, useWalletStore } from '@/states';

const Provider = ({ children }: { children: ReactNode }) => {
  const initializeWallets = useWalletStore(state => state.initializeWallets);
  const initializeContracts = useContractStore(
    state => state.initializeContracts
  );
  useEffect(() => {
    // Initialize app configuration
    const initialize = async () => {
      try {
        // Initialize wallets and contracts in parallel
        await Promise.all([initializeWallets(), initializeContracts()]);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initialize();
  }, [initializeWallets, initializeContracts]);
  return (
    <ThemeProvider attribute='class' defaultTheme='dark'>
      <Header />
      <BodyProvider>{children}</BodyProvider>
    </ThemeProvider>
  );
};

export { Provider };
