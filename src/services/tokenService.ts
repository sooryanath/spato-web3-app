import { Contract, AccountInterface, ProviderInterface } from 'starknet';
import { CONTRACT_CONFIG, STRK_TOKEN_CONFIG, formatTokenAmount, parseTokenAmount, checkTransactionStatus, formatNumberWithCommas, createProviderWithFailover } from '@/utils/walletUtils';

export interface TokenMintResult {
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: string;
  blockHash?: string;
}

export interface TokenBalance {
  formatted: string;
  raw: { low: string; high: string };
  isRealData: boolean;
}

export interface MultiTokenBalance {
  cat: TokenBalance;
  strk: TokenBalance;
}

export class TokenService {
  private catContract: Contract;
  private strkContract: Contract;
  private account: AccountInterface;
  private provider: ProviderInterface;
  private isUsingFallbackProvider: boolean = false;

  constructor(account: AccountInterface, provider: ProviderInterface) {
    this.account = account;
    this.provider = provider;
    this.catContract = new Contract(CONTRACT_CONFIG.abi, CONTRACT_CONFIG.address, account);
    this.strkContract = new Contract(STRK_TOKEN_CONFIG.abi, STRK_TOKEN_CONFIG.address, account);
    
    console.log('🔧 TokenService initialized:', {
      environment: process.env.NODE_ENV,
      catAddress: CONTRACT_CONFIG.address,
      strkAddress: STRK_TOKEN_CONFIG.address,
      accountAddress: account.address,
      network: CONTRACT_CONFIG.network
    });
  }

  // Enhanced initialization with provider failover
  static async createWithFailover(account: AccountInterface): Promise<TokenService> {
    try {
      const enhancedProvider = await createProviderWithFailover(CONTRACT_CONFIG.network);
      return new TokenService(account, enhancedProvider);
    } catch (error) {
      console.error('❌ Failed to create enhanced provider, using fallback:', error);
      // Create a fallback provider instead of trying to access account.provider
      const fallbackProvider = await createProviderWithFailover(CONTRACT_CONFIG.network);
      return new TokenService(account, fallbackProvider);
    }
  }

  // Enhanced contract response validation
  private validateContractResponse(response: any, tokenSymbol: string): { low: string; high: string } | null {
    console.log(`🔍 Validating ${tokenSymbol} contract response:`, response);
    
    // Handle different response formats
    if (!response) {
      console.warn(`⚠️ ${tokenSymbol} response is null/undefined`);
      return null;
    }

    // If response is already in the correct format
    if (response.low !== undefined && response.high !== undefined) {
      return {
        low: response.low.toString(),
        high: response.high.toString()
      };
    }

    // If response is an array with two elements
    if (Array.isArray(response) && response.length === 2) {
      return {
        low: response[0].toString(),
        high: response[1].toString()
      };
    }

    // If response has a different structure, try to extract values
    if (typeof response === 'object') {
      // Check for common alternative property names
      const possibleLow = response.low || response[0] || response.value?.low;
      const possibleHigh = response.high || response[1] || response.value?.high;
      
      if (possibleLow !== undefined && possibleHigh !== undefined) {
        return {
          low: possibleLow.toString(),
          high: possibleHigh.toString()
        };
      }
    }

    // If it's a single value, treat as low with high = 0
    if (typeof response === 'string' || typeof response === 'number') {
      return {
        low: response.toString(),
        high: '0'
      };
    }

    console.error(`❌ ${tokenSymbol} response format not recognized:`, response);
    return null;
  }

  async mintTokens(recipient: string, amount: string): Promise<TokenMintResult> {
    try {
      console.log(`🪙 Minting ${amount} CAT tokens to ${recipient} using contract ${CONTRACT_CONFIG.address}`);
      
      // Check if we're in development mode and using mock contract
      if (process.env.NODE_ENV === 'development' && CONTRACT_CONFIG.address.includes('12345678901234567890')) {
        console.log('🔧 Development mode detected with mock contract - simulating mint operation');
        
        // Return a simulated successful mint for development
        const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
        
        const mintResult: TokenMintResult = {
          transactionHash: mockTxHash,
          status: 'confirmed'
        };
        
        console.log('✅ Mock mint transaction completed:', mockTxHash);
        return mintResult;
      }
      
      // Format amount for Cairo u256
      const formattedAmount = formatTokenAmount(amount, CONTRACT_CONFIG.decimals);
      console.log('🔢 Formatted amount for contract:', formattedAmount);
      
      // Call mint function on real contract
      const result = await this.catContract.mint(recipient, formattedAmount);
      
      console.log('✅ Real mint transaction submitted:', result.transaction_hash);
      
      // Return initial result
      const mintResult: TokenMintResult = {
        transactionHash: result.transaction_hash,
        status: 'pending'
      };

      // Monitor transaction status in background
      this.monitorTransaction(result.transaction_hash, mintResult);
      
      return mintResult;
      
    } catch (error) {
      console.error('❌ Error minting tokens:', error);
      throw this.handleContractError(error);
    }
  }

  async getBalance(address: string): Promise<TokenBalance> {
    const maxRetries = 2;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        console.log(`💰 Fetching CAT balance for ${address} (attempt ${retries + 1}/${maxRetries})`);
        
        const balance = await this.catContract.balance_of(address);
        console.log('🔍 Raw CAT balance response:', balance);
        
        const validatedBalance = this.validateContractResponse(balance, 'CAT');
        if (!validatedBalance) {
          throw new Error('Invalid CAT balance response format');
        }
        
        const formatted = parseTokenAmount(
          validatedBalance.low, 
          validatedBalance.high, 
          CONTRACT_CONFIG.decimals
        );
        
        const formattedWithCommas = formatNumberWithCommas(formatted);
        
        console.log(`✅ CAT balance retrieved: ${formattedWithCommas}`);
        
        return {
          formatted: formattedWithCommas,
          raw: validatedBalance,
          isRealData: true
        };
      } catch (error) {
        retries++;
        console.error(`❌ Error getting CAT balance (attempt ${retries}):`, error);
        
        if (retries >= maxRetries) {
          const fallbackBalance = process.env.NODE_ENV === 'development' ? '1,250.50' : '0';
          console.log(`🔄 Using fallback CAT balance: ${fallbackBalance}`);
          
          return {
            formatted: fallbackBalance,
            raw: { low: '0', high: '0' },
            isRealData: false
          };
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    throw new Error('Failed to get CAT balance after all retries');
  }

  async getStrkBalance(address: string): Promise<TokenBalance> {
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        console.log(`💎 Fetching STRK balance for ${address} (attempt ${retries + 1}/${maxRetries})`);
        console.log(`🔗 Using STRK contract address: ${STRK_TOKEN_CONFIG.address}`);
        
        const balance = await this.strkContract.balance_of(address);
        console.log('🔍 Raw STRK balance response:', balance);
        console.log('🔍 STRK response type:', typeof balance);
        console.log('🔍 STRK response keys:', balance ? Object.keys(balance) : 'no keys');
        
        const validatedBalance = this.validateContractResponse(balance, 'STRK');
        if (!validatedBalance) {
          throw new Error('Invalid STRK balance response format');
        }
        
        console.log('🔍 Validated STRK balance:', validatedBalance);
        
        const formatted = parseTokenAmount(
          validatedBalance.low, 
          validatedBalance.high, 
          STRK_TOKEN_CONFIG.decimals
        );
        
        const formattedWithCommas = formatNumberWithCommas(formatted);
        
        console.log(`✅ STRK balance retrieved: ${formattedWithCommas}`);
        
        return {
          formatted: formattedWithCommas,
          raw: validatedBalance,
          isRealData: true
        };
      } catch (error) {
        retries++;
        console.error(`❌ Error getting STRK balance (attempt ${retries}):`, error);
        console.error('🔍 Full STRK error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        if (retries >= maxRetries) {
          const fallbackBalance = process.env.NODE_ENV === 'development' ? '45.75' : '0';
          console.log(`🔄 Using fallback STRK balance: ${fallbackBalance}`);
          
          return {
            formatted: fallbackBalance,
            raw: { low: '0', high: '0' },
            isRealData: false
          };
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500 * retries)); // Increased delay
      }
    }
    
    throw new Error('Failed to get STRK balance after all retries');
  }

  async getAllBalances(address: string): Promise<MultiTokenBalance> {
    try {
      console.log(`📊 Fetching all balances for ${address}`);
      
      // Fetch both balances concurrently but handle errors independently
      const [catBalance, strkBalance] = await Promise.allSettled([
        this.getBalance(address),
        this.getStrkBalance(address)
      ]);

      const catResult = catBalance.status === 'fulfilled' 
        ? catBalance.value 
        : { formatted: process.env.NODE_ENV === 'development' ? '1,250.50' : '0', raw: { low: '0', high: '0' }, isRealData: false };
        
      const strkResult = strkBalance.status === 'fulfilled' 
        ? strkBalance.value 
        : { formatted: process.env.NODE_ENV === 'development' ? '45.75' : '0', raw: { low: '0', high: '0' }, isRealData: false };

      console.log('✅ All balances retrieved:', {
        CAT: `${catResult.formatted} (${catResult.isRealData ? 'real' : 'fallback'})`,
        STRK: `${strkResult.formatted} (${strkResult.isRealData ? 'real' : 'fallback'})`
      });

      return {
        cat: catResult,
        strk: strkResult
      };
    } catch (error) {
      console.error('❌ Error getting all balances:', error);
      
      // Return fallback balances
      const fallbackBalances = {
        cat: { 
          formatted: process.env.NODE_ENV === 'development' ? '1,250.50' : '0', 
          raw: { low: '0', high: '0' },
          isRealData: false
        },
        strk: { 
          formatted: process.env.NODE_ENV === 'development' ? '45.75' : '0', 
          raw: { low: '0', high: '0' },
          isRealData: false
        }
      };
      
      console.log('🔄 Using fallback balances:', fallbackBalances);
      return fallbackBalances;
    }
  }

  async getTotalSupply(): Promise<TokenBalance> {
    try {
      console.log('📈 Fetching CAT total supply');
      
      const supply = await this.catContract.total_supply();
      
      const validatedSupply = this.validateContractResponse(supply, 'CAT Supply');
      if (!validatedSupply) {
        throw new Error('Invalid total supply response format');
      }
      
      const formatted = parseTokenAmount(
        validatedSupply.low, 
        validatedSupply.high, 
        CONTRACT_CONFIG.decimals
      );
      
      const formattedWithCommas = formatNumberWithCommas(formatted);
      
      console.log(`✅ Total supply retrieved: ${formattedWithCommas}`);
      
      return {
        formatted: formattedWithCommas,
        raw: validatedSupply,
        isRealData: true
      };
    } catch (error) {
      console.error('❌ Error getting total supply:', error);
      throw this.handleContractError(error);
    }
  }

  private async monitorTransaction(txHash: string, result: TokenMintResult): Promise<void> {
    try {
      console.log('👀 Monitoring transaction:', txHash);
      const status = await checkTransactionStatus(this.provider, txHash);
      
      result.status = status.status === 'SUCCEEDED' ? 'confirmed' : 'failed';
      result.blockNumber = status.blockNumber;
      result.blockHash = status.blockHash;
      
      console.log(`✅ Transaction ${txHash} ${result.status}`, status);
    } catch (error) {
      console.error('❌ Error monitoring transaction:', error);
      result.status = 'failed';
    }
  }

  private handleContractError(error: any): Error {
    console.error('🔧 Processing contract error:', error);
    
    if (error.message?.includes('insufficient balance')) {
      return new Error('Insufficient balance to perform this transaction');
    }
    
    if (error.message?.includes('unauthorized')) {
      return new Error('Unauthorized to mint tokens - check contract permissions');
    }
    
    if (error.message?.includes('invalid recipient')) {
      return new Error('Invalid recipient address provided');
    }
    
    if (error.message?.includes('Failed to fetch')) {
      return new Error('Network connection error - please check your internet connection');
    }
    
    // Generic error handling
    return new Error(`Contract operation failed: ${error.message || 'Unknown error'}`);
  }
}

export const createTokenService = async (account: AccountInterface, provider?: ProviderInterface): Promise<TokenService> => {
  console.log('🏭 Creating TokenService instance with enhanced provider');
  
  if (provider) {
    return new TokenService(account, provider);
  }
  
  return await TokenService.createWithFailover(account);
};
