import { getStarknet } from 'get-starknet-core';
import { RpcProvider } from 'starknet';

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

// Environment-specific contract configurations
const getContractConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    // Custom CAT token address - update with actual deployed contract address
    // TODO: Replace with your deployed CAT token contract address
    address: isDevelopment 
      ? '0x12345678901234567890123456789012345678901234567890123456789abcde' // Mock address for development
      : '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // Production address - REPLACE WITH YOUR DEPLOYED CONTRACT
    abi: CAT_TOKEN_ABI,
    name: 'CAT Token',
    symbol: 'CAT',
    decimals: 18
  };
};

// Contract configuration - using function to support environment-specific config
export const CONTRACT_CONFIG = getContractConfig();

// STRK Token configuration (official StarkNet token) - Updated address for Sepolia testnet
export const STRK_TOKEN_CONFIG = {
  address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // Correct STRK token address for Sepolia
  abi: CAT_TOKEN_ABI, // Same ERC20 ABI
  name: 'StarkNet Token',
  symbol: 'STRK',
  decimals: 18
};

// Enhanced RPC Endpoints with better failover support
export const RPC_ENDPOINTS = {
  mainnet: [
    'https://starknet-mainnet.public.blastapi.io',
    'https://free-rpc.nethermind.io/mainnet-juno/',
    'https://starknet-mainnet.reddio.com'
  ],
  sepolia: [
    'https://starknet-sepolia.public.blastapi.io',
    'https://free-rpc.nethermind.io/sepolia-juno/',
    'https://rpc.nethermind.io/sepolia-juno',
    'https://starknet-sepolia.reddio.com'
  ]
};

// Create provider with failover support
export const createProviderWithFailover = async (network: 'mainnet' | 'sepolia' = 'sepolia'): Promise<RpcProvider> => {
  const endpoints = RPC_ENDPOINTS[network];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔗 Attempting to connect to RPC: ${endpoint}`);
      const provider = new RpcProvider({ nodeUrl: endpoint });
      
      // Test the connection
      await provider.getChainId();
      console.log(`✅ Successfully connected to RPC: ${endpoint}`);
      return provider;
    } catch (error) {
      console.warn(`⚠️ Failed to connect to RPC ${endpoint}:`, error);
      continue;
    }
  }
  
  // If all endpoints fail, use the first one as fallback
  console.warn('⚠️ All RPC endpoints failed, using fallback');
  return new RpcProvider({ nodeUrl: endpoints[0] });
};

export const detectWallets = async (): Promise<WalletInfo[]> => {
  try {
    console.log('🔍 Detecting available wallets...');
    const starknet = getStarknet();
    const availableWallets = await starknet.getAvailableWallets();
    
    const wallets = SUPPORTED_WALLETS.map(wallet => ({
      ...wallet,
      installed: availableWallets.some(w => w.id === wallet.id)
    }));
    
    console.log('✅ Wallets detected:', wallets);
    return wallets;
  } catch (error) {
    console.error('❌ Error detecting wallets:', error);
    return SUPPORTED_WALLETS;
  }
};

export const connectToWallet = async (walletId: string) => {
  try {
    console.log(`🔗 Connecting to wallet: ${walletId}`);
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

    // Create a more reliable provider
    const enhancedProvider = await createProviderWithFailover();
    
    console.log('✅ Wallet connected successfully:', {
      address: walletInstance.account.address,
      chainId: walletInstance.provider?.chainId
    });

    return {
      ...walletInstance,
      provider: enhancedProvider // Use our enhanced provider
    };
  } catch (error) {
    console.error('❌ Error connecting to wallet:', error);
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

// Enhanced token amount parsing with better error handling
export const parseTokenAmount = (low: string, high: string, decimals: number = 18): string => {
  try {
    console.log(`🔢 Parsing token amount - low: ${low}, high: ${high}, decimals: ${decimals}`);
    
    // Validate inputs
    if (!low && !high) {
      console.warn('⚠️ Both low and high are empty, returning 0');
      return '0';
    }
    
    // Handle cases where values might be undefined or null
    const safeLow = low ? low.toString() : '0';
    const safeHigh = high ? high.toString() : '0';
    
    // Convert to BigInt safely
    let lowBN: bigint;
    let highBN: bigint;
    
    try {
      lowBN = BigInt(safeLow);
      highBN = BigInt(safeHigh);
    } catch (conversionError) {
      console.error('❌ Error converting to BigInt:', conversionError);
      return '0';
    }
    
    // Reconstruct the full amount
    const amountBN = (highBN << BigInt(128)) + lowBN;
    console.log(`🔢 Reconstructed amount BigInt: ${amountBN.toString()}`);
    
    if (amountBN === BigInt(0)) {
      return '0';
    }
    
    const divisor = BigInt(10 ** decimals);
    const wholePart = amountBN / divisor;
    const fractionalPart = amountBN % divisor;
    
    console.log(`🔢 Whole part: ${wholePart}, Fractional part: ${fractionalPart}`);
    
    if (fractionalPart === BigInt(0)) {
      return wholePart.toString();
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, '');
    
    const result = trimmedFractional ? `${wholePart}.${trimmedFractional}` : wholePart.toString();
    console.log(`✅ Final parsed amount: ${result}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error parsing token amount:', error);
    return '0';
  }
};

// Enhanced transaction status checker with retry logic
export const checkTransactionStatus = async (provider: any, txHash: string, maxRetries: number = 3) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      console.log(`📊 Checking transaction status (attempt ${retries + 1}/${maxRetries}):`, txHash);
      const receipt = await provider.waitForTransaction(txHash);
      
      const status = {
        status: receipt.status || receipt.execution_status,
        blockNumber: receipt.block_number,
        blockHash: receipt.block_hash
      };
      
      console.log('✅ Transaction status retrieved:', status);
      return status;
    } catch (error) {
      retries++;
      console.error(`❌ Error checking transaction status (attempt ${retries}):`, error);
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * retries));
    }
  }
};

// Utility function to format numbers with commas
export const formatNumberWithCommas = (num: string): string => {
  if (!num || num === '0') return '0';
  
  try {
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  } catch (error) {
    console.error('❌ Error formatting number with commas:', error);
    return num; // Return original if formatting fails
  }
};

// Enhanced contract configuration update utility
export const updateContractAddress = (newAddress: string) => {
  console.log(`🔧 Updating contract address to: ${newAddress}`);
  // In a production app, this would update environment variables or configuration
  // For now, it logs the instruction for manual update
  console.log('⚠️ Manual Update Required: Update CONTRACT_CONFIG.address in walletUtils.ts');
  return newAddress;
};

// Contract deployment validation
export const validateContractAddress = (address: string): boolean => {
  if (!address || !address.startsWith('0x')) return false;
  if (address.length < 10) return false; // Minimum reasonable length
  return true;
};

// Development mode helpers
export const getDeploymentInstructions = () => {
  return {
    steps: [
      "1. Connect your StarkNet wallet (Argent X or Braavos)",
      "2. Ensure you have enough ETH for deployment fees",
      "3. Use the Contract Deployment component to deploy your CAT token",
      "4. Copy the deployed contract address",
      "5. Update CONTRACT_CONFIG.address in src/utils/walletUtils.ts",
      "6. Restart the application to use the new contract"
    ],
    contractInfo: {
      currentAddress: CONTRACT_CONFIG.address,
      isTestAddress: CONTRACT_CONFIG.address.includes('1234567890abcdef'),
      network: process.env.NODE_ENV === 'development' ? 'Development' : 'Production'
    }
  };
};
