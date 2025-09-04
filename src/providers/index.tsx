'use client';

import { ReactNode, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { getApolloClient } from '@/graphql/clientsFactory';

import Header from '@/components/Header';

import BodyProvider from './BodyProvider';
import { ThemeProvider } from './ThemeProvider';
import { useContractStore, useWalletStore } from '@/states';
import { updateAllClientsSignTransaction } from '@/states/contract-store';

const Provider = ({ children }: { children: ReactNode }) => {
  const initializeWallets = useWalletStore(state => state.initializeWallets);
  const initializeContracts = useContractStore(
    state => state.initializeContracts
  );
  useEffect(() => {
    // Initialize app configuration
    const initialize = async () => {
      try {
        // Init contracts first so clients exist for signer injection
        await initializeContracts();
        await initializeWallets();

        // After hydration, if wallet was persisted as connected, repair and inject signers
        const {
          isConnected,
          connectedWallet,
          walletAdapter,
          validateAndFixWalletConnection,
        } = useWalletStore.getState();

        if (isConnected && connectedWallet) {
          try {
            await validateAndFixWalletConnection();
            const current = useWalletStore.getState();
            if (current.walletAdapter && current.connectedWallet) {
              await updateAllClientsSignTransaction(
                current.walletAdapter,
                current.connectedWallet
              );
            }
          } catch (e) {
            console.warn('Wallet revalidation failed on init:', e);
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initialize();
  }, [initializeWallets, initializeContracts]);
  return (
    <ApolloProvider client={getApolloClient()}>
      <ThemeProvider attribute='class' defaultTheme='dark'>
        <Header />
        <BodyProvider>{children}</BodyProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export { Provider };
