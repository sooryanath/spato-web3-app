
import { getStarknet } from 'get-starknet-core';

export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  installed: boolean;
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: 'argentX',
    name: 'Argent X',
    icon: 'https://www.argent.xyz/assets/icons/argent-x-icon.svg',
    installed: false
  },
  {
    id: 'braavos',
    name: 'Braavos',
    icon: 'https://braavos.app/assets/logo.svg',
    installed: false
  }
];

export const detectWallets = async (): Promise<WalletInfo[]> => {
  try {
    const starknet = getStarknet();
    const availableWallets = await starknet.getAvailableWallets();
    
    return SUPPORTED_WALLETS.map(wallet => ({
      ...wallet,
      installed: availableWallets.some(w => w.id === wallet.id)
    }));
  } catch (error) {
    console.error('Error detecting wallets:', error);
    return SUPPORTED_WALLETS;
  }
};

export const connectToWallet = async (walletId: string) => {
  try {
    const starknet = getStarknet();
    const availableWallets = await starknet.getAvailableWallets();
    
    const targetWallet = availableWallets.find(w => w.id === walletId);
    if (!targetWallet) {
      throw new Error(`Wallet ${walletId} not found`);
    }

    const walletInstance = await starknet.enable(targetWallet);
    
    if (!walletInstance?.account) {
      throw new Error('Failed to connect to wallet');
    }

    return walletInstance;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getNetworkName = (chainId: string): string => {
  switch (chainId) {
    case '0x534e5f4d41494e':
      return 'StarkNet Mainnet';
    case '0x534e5f474f45524c49':
      return 'StarkNet Goerli';
    case '0x534e5f5345504f4c4941':
      return 'StarkNet Sepolia';
    default:
      return 'Unknown Network';
  }
};
