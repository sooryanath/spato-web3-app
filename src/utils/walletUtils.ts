
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

// Cairo ERC20 Contract ABI
export const CAT_TOKEN_ABI = [
  {
    "name": "mint",
    "type": "function",
    "inputs": [
      {
        "name": "recipient",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "name": "transfer",
    "type": "function", 
    "inputs": [
      {
        "name": "recipient",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [
      {
        "type": "core::bool"
      }
    ],
    "state_mutability": "external"
  },
  {
    "name": "balance_of",
    "type": "function",
    "inputs": [
      {
        "name": "account",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [
      {
        "type": "core::integer::u256"
      }
    ],
    "state_mutability": "view"
  },
  {
    "name": "total_supply",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "type": "core::integer::u256"
      }
    ],
    "state_mutability": "view"
  },
  {
    "name": "name",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "type": "core::byte_array::ByteArray"
      }
    ],
    "state_mutability": "view"
  },
  {
    "name": "symbol",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "type": "core::byte_array::ByteArray"
      }
    ],
    "state_mutability": "view"
  }
];

// Contract configuration - update with actual deployed contract address
export const CONTRACT_CONFIG = {
  address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // Placeholder - replace with actual deployed address
  abi: CAT_TOKEN_ABI,
  name: 'CAT Token',
  symbol: 'CAT',
  decimals: 18
};

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

// Cairo-compatible amount formatting
export const formatTokenAmount = (amount: string, decimals: number = 18): { low: string; high: string } => {
  const amountBN = BigInt(amount) * BigInt(10 ** decimals);
  const low = (amountBN & BigInt('0xffffffffffffffffffffffffffffffff')).toString();
  const high = (amountBN >> BigInt(128)).toString();
  return { low, high };
};

// Parse Cairo u256 to readable amount
export const parseTokenAmount = (low: string, high: string, decimals: number = 18): string => {
  const amountBN = (BigInt(high) << BigInt(128)) + BigInt(low);
  const divisor = BigInt(10 ** decimals);
  const wholePart = amountBN / divisor;
  const fractionalPart = amountBN % divisor;
  
  if (fractionalPart === BigInt(0)) {
    return wholePart.toString();
  }
  
  const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
  const trimmedFractional = fractionalStr.replace(/0+$/, '');
  
  return trimmedFractional ? `${wholePart}.${trimmedFractional}` : wholePart.toString();
};

// Transaction status checker
export const checkTransactionStatus = async (provider: any, txHash: string) => {
  try {
    const receipt = await provider.waitForTransaction(txHash);
    return {
      status: receipt.status || receipt.execution_status,
      blockNumber: receipt.block_number,
      blockHash: receipt.block_hash
    };
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
};
