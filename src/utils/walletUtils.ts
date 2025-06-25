
import { getStarknet } from 'get-starknet-core';
import { RpcProvider, Contract } from 'starknet';

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

// Complete ABI based on the actual deployed contract functions
export const CAT_TOKEN_ABI = [
  {
    "name": "add_bank",
    "type": "function",
    "inputs": [
      {
        "name": "bank_address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  },
  {
    "name": "mint_to_anchor",
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
    "name": "transfer_from",
    "type": "function",
    "inputs": [
      {
        "name": "sender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
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
    "name": "approve",
    "type": "function",
    "inputs": [
      {
        "name": "spender",
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
    "name": "allowance",
    "type": "function",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "spender",
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
    "name": "balanceOf",
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
    "name": "totalSupply",
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

// Environment detection utility
const getEnvironment = (): 'development' | 'testnet' | 'mainnet' => {
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }
  return 'testnet';
};

// Environment-specific contract configurations
const getContractConfig = () => {
  const environment = getEnvironment();
  
  console.log(`🌍 Current environment: ${environment}`);
  
  switch (environment) {
    case 'development':
      return {
        address: '0x0323569840755faaed149227f6110911d73255eb1f14df3614181e8d7fec315e', // Use real testnet contract even in dev
        abi: CAT_TOKEN_ABI,
        name: 'CAT Token',
        symbol: 'CAT',
        decimals: 18,
        network: 'sepolia' as const
      };
    
    case 'testnet':
      return {
        address: '0x0323569840755faaed149227f6110911d73255eb1f14df3614181e8d7fec315e',
        abi: CAT_TOKEN_ABI,
        name: 'CAT Token',
        symbol: 'CAT',
        decimals: 18,
        network: 'sepolia' as const
      };
    
    case 'mainnet':
      return {
        address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        abi: CAT_TOKEN_ABI,
        name: 'CAT Token',
        symbol: 'CAT',
        decimals: 18,
        network: 'mainnet' as const
      };
    
    default:
      return {
        address: '0x0323569840755faaed149227f6110911d73255eb1f14df3614181e8d7fec315e',
        abi: CAT_TOKEN_ABI,
        name: 'CAT Token',
        symbol: 'CAT',
        decimals: 18,
        network: 'sepolia' as const
      };
  }
};

export const CONTRACT_CONFIG = getContractConfig();

export const STRK_TOKEN_CONFIG = {
  address: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
  abi: CAT_TOKEN_ABI,
  name: 'StarkNet Token',
  symbol: 'STRK',
  decimals: 18
};

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

export const createProviderWithFailover = async (network: 'mainnet' | 'sepolia' = 'sepolia'): Promise<RpcProvider> => {
  const endpoints = RPC_ENDPOINTS[network];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔗 Attempting to connect to RPC: ${endpoint}`);
      const provider = new RpcProvider({ nodeUrl: endpoint });
      
      await provider.getChainId();
      console.log(`✅ Successfully connected to RPC: ${endpoint}`);
      return provider;
    } catch (error) {
      console.warn(`⚠️ Failed to connect to RPC ${endpoint}:`, error);
      continue;
    }
  }
  
  console.warn('⚠️ All RPC endpoints failed, using fallback');
  return new RpcProvider({ nodeUrl: endpoints[0] });
};

// Add contract introspection utility
export const validateContractABI = async (contractAddress: string, abi: any[], provider: RpcProvider): Promise<boolean> => {
  try {
    console.log(`🔍 Validating contract ABI for address: ${contractAddress}`);
    
    const contract = new Contract(abi, contractAddress, provider);
    
    // Test the specific functions that should exist in the contract
    const testFunctions = ['add_bank', 'mint_to_anchor', 'balanceOf', 'balance_of'];
    
    for (const functionName of testFunctions) {
      try {
        const hasFunction = contract[functionName] !== undefined;
        console.log(`📋 Function ${functionName}: ${hasFunction ? '✅' : '❌'}`);
        
        if (hasFunction && (functionName === 'add_bank' || functionName === 'mint_to_anchor')) {
          console.log(`✅ Contract has ${functionName} function - ABI appears valid for CAT contract`);
          return true;
        }
      } catch (error) {
        console.log(`⚠️ Error testing function ${functionName}:`, error);
      }
    }
    
    console.warn('⚠️ No CAT-specific functions found in contract');
    return false;
  } catch (error) {
    console.error('❌ Error validating contract ABI:', error);
    return false;
  }
};

// Enhanced contract investigation utility
export const investigateContract = async (contractAddress: string, provider: RpcProvider) => {
  try {
    console.log(`🔍 Investigating contract at address: ${contractAddress}`);
    
    // Get contract class hash
    const classHash = await provider.getClassHashAt(contractAddress);
    console.log(`📝 Contract class hash: ${classHash}`);
    
    // Get contract class to inspect ABI
    const contractClass = await provider.getClass(classHash);
    console.log(`📋 Contract class retrieved:`, contractClass);
    
    // Try to extract function names from the contract
    if (contractClass.abi) {
      console.log(`📋 Available functions in contract ABI:`);
      contractClass.abi.forEach((item: any) => {
        if (item.type === 'function') {
          console.log(`  - ${item.name} (${item.state_mutability})`);
        }
      });
    }
    
    return contractClass;
  } catch (error) {
    console.error('❌ Error investigating contract:', error);
    throw error;
  }
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
    
    // Get available wallets first
    const availableWallets = await starknet.getAvailableWallets();
    console.log('📋 Available wallets:', availableWallets);
    
    const targetWallet = availableWallets.find(w => w.id === walletId);
    if (!targetWallet) {
      throw new Error(`Wallet ${walletId} not found. Available wallets: ${availableWallets.map(w => w.id).join(', ')}`);
    }

    console.log(`🎯 Found target wallet:`, targetWallet);
    
    // Enable the wallet without the invalid showModal property
    const walletInstance = await starknet.enable(targetWallet);
    
    console.log(`🔄 Wallet instance created:`, {
      account: !!walletInstance?.account,
      provider: !!walletInstance?.provider,
      address: walletInstance?.account?.address
    });
    
    if (!walletInstance?.account) {
      throw new Error(`Failed to get account from wallet ${walletId}`);
    }

    // Create enhanced provider
    const enhancedProvider = await createProviderWithFailover(CONTRACT_CONFIG.network);
    
    // Validate contract ABI before proceeding
    console.log('🔍 Validating contract ABI...');
    const isValidABI = await validateContractABI(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, enhancedProvider);
    
    if (!isValidABI) {
      console.warn('⚠️ Contract ABI validation failed, investigating contract...');
      await investigateContract(CONTRACT_CONFIG.address, enhancedProvider);
    }
    
    console.log('✅ Wallet connected successfully:', {
      address: walletInstance.account.address,
      chainId: walletInstance.provider?.chainId,
      environment: getEnvironment(),
      contractAddress: CONTRACT_CONFIG.address,
      abiValid: isValidABI
    });

    return {
      ...walletInstance,
      provider: enhancedProvider
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

export const formatTokenAmount = (amount: string, decimals: number = 18): { low: string; high: string } => {
  const amountBN = BigInt(amount) * BigInt(10 ** decimals);
  const low = (amountBN & BigInt('0xffffffffffffffffffffffffffffffff')).toString();
  const high = (amountBN >> BigInt(128)).toString();
  return { low, high };
};

export const parseTokenAmount = (low: string, high: string, decimals: number = 18): string => {
  try {
    console.log(`🔢 Parsing token amount - low: ${low}, high: ${high}, decimals: ${decimals}`);
    
    if (!low && !high) {
      console.warn('⚠️ Both low and high are empty, returning 0');
      return '0';
    }
    
    const safeLow = low ? low.toString() : '0';
    const safeHigh = high ? high.toString() : '0';
    
    let lowBN: bigint;
    let highBN: bigint;
    
    try {
      lowBN = BigInt(safeLow);
      highBN = BigInt(safeHigh);
    } catch (conversionError) {
      console.error('❌ Error converting to BigInt:', conversionError);
      return '0';
    }
    
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
      
      await new Promise(resolve => setTimeout(resolve, 2000 * retries));
    }
  }
};

export const formatNumberWithCommas = (num: string): string => {
  if (!num || num === '0') return '0';
  
  try {
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  } catch (error) {
    console.error('❌ Error formatting number with commas:', error);
    return num;
  }
};
