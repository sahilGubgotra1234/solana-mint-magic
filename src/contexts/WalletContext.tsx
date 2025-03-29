
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Connection, PublicKey, clusterApiUrl, Cluster } from '@solana/web3.js';
import { toast } from 'sonner';

type WalletProviderType = 'phantom' | 'solflare' | null;

interface WalletContextType {
  wallet: any | null;
  publicKey: PublicKey | null;
  connecting: boolean;
  connected: boolean;
  connectWallet: (providerType: WalletProviderType) => Promise<void>;
  disconnectWallet: () => void;
  solanaConnection: Connection | null;
  cluster: Cluster;
  setCluster: (cluster: Cluster) => void;
  walletProvider: WalletProviderType;
  balance: number;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  publicKey: null,
  connecting: false,
  connected: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  solanaConnection: null,
  cluster: 'devnet',
  setCluster: () => {},
  walletProvider: null,
  balance: 0,
  refreshBalance: async () => {},
});

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [wallet, setWallet] = useState<any | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [cluster, setCluster] = useState<Cluster>('devnet');
  const [solanaConnection, setSolanaConnection] = useState<Connection | null>(null);
  const [walletProvider, setWalletProvider] = useState<WalletProviderType>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    const connection = new Connection(clusterApiUrl(cluster), 'confirmed');
    setSolanaConnection(connection);
  }, [cluster]);

  useEffect(() => {
    if (publicKey && solanaConnection) {
      refreshBalance();
    }
  }, [publicKey, solanaConnection]);
  
  // Improved wallet providers detection
  const getPhantomProvider = () => {
    if ('phantom' in window) {
      const phantom = (window as any).phantom?.solana;
      if (phantom?.isPhantom) {
        console.log("Phantom provider detected successfully");
        return phantom;
      }
    }
    console.log("Phantom provider not detected");
    return null;
  };
  
  const getSolflareProvider = () => {
    if ('solflare' in window) {
      const solflare = (window as any).solflare;
      if (solflare?.isSolflare) {
        console.log("Solflare provider detected successfully");
        return solflare;
      }
    }
    console.log("Solflare provider not detected");
    return null;
  };

  const refreshBalance = async () => {
    try {
      if (publicKey && solanaConnection) {
        const bal = await solanaConnection.getBalance(publicKey);
        setBalance(bal / 1_000_000_000); // Convert lamports to SOL
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = async (providerType: WalletProviderType) => {
    try {
      setConnecting(true);
      console.log(`Attempting to connect to ${providerType} wallet...`);
      
      let provider;
      if (providerType === 'phantom') {
        provider = getPhantomProvider();
        if (!provider) {
          window.open('https://phantom.app/', '_blank');
          toast.error('Phantom wallet not found', {
            description: 'Please install Phantom wallet extension and reload the page'
          });
          setConnecting(false);
          return;
        }
      } else if (providerType === 'solflare') {
        provider = getSolflareProvider();
        if (!provider) {
          window.open('https://solflare.com/', '_blank');
          toast.error('Solflare wallet not found', {
            description: 'Please install Solflare wallet extension and reload the page'
          });
          setConnecting(false);
          return;
        }
      }
      
      if (!provider) {
        toast.error('Wallet provider not supported');
        setConnecting(false);
        return;
      }

      console.log("Provider found, attempting connection...");
      const resp = await provider.connect();
      console.log("Connection response:", resp);
      
      const publicKey = new PublicKey(resp.publicKey.toString());
      
      setWalletProvider(providerType);
      setWallet(provider);
      setPublicKey(publicKey);
      setConnected(true);
      
      toast.success('Wallet connected', {
        description: `Connected to ${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
      });
      
      // Setup disconnect event listener
      provider.on('disconnect', () => {
        disconnectWallet();
      });
      
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast.error('Connection failed', {
        description: error.message || 'Could not connect to wallet'
      });
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    if (wallet) {
      wallet.disconnect().catch(console.error);
    }
    setWallet(null);
    setPublicKey(null);
    setConnected(false);
    setWalletProvider(null);
    toast.info('Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        publicKey,
        connecting,
        connected,
        connectWallet,
        disconnectWallet,
        solanaConnection,
        cluster,
        setCluster,
        walletProvider,
        balance,
        refreshBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
