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
  isRealData: boolean; // New field to indicate if data is real or fallback
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
      catAddress: CONTRACT_CONFIG.address,
      strkAddress: STRK_TOKEN_CONFIG.address,
      accountAddress: account.address
    });
  }

  // Enhanced initialization with provider failover
  static async createWithFailover(account: AccountInterface): Promise<TokenService> {
    try {
      const enhancedProvider = await createProviderWithFailover();
      return new TokenService(account, enhancedProvider);
    } catch (error) {
      console.error('❌ Failed to create enhanced provider, using fallback:', error);
      // Create a fallback provider instead of trying to access account.provider
      const fallbackProvider = await createProviderWithFailover();
      return new TokenService(account, fallbackProvider);
    }
  }

  async mintTokens(recipient: string, amount: string): Promise<TokenMintResult> {
    try {
      console.log(`🪙 Minting ${amount} CAT tokens to ${recipient}`);
      
      // Format amount for Cairo u256
      const formattedAmount = formatTokenAmount(amount, CONTRACT_CONFIG.decimals);
      
      // Call mint function
      const result = await this.catContract.mint(recipient, formattedAmount);
      
      console.log('✅ Mint transaction submitted:', result.transaction_hash);
      
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
    const maxRetries = 2; // Reduced retries for faster response
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        console.log(`💰 Fetching CAT balance for ${address} (attempt ${retries + 1}/${maxRetries})`);
        
        const balance = await this.catContract.balance_of(address);
        
        const formatted = parseTokenAmount(
          balance.low.toString(), 
          balance.high.toString(), 
          CONTRACT_CONFIG.decimals
        );
        
        const formattedWithCommas = formatNumberWithCommas(formatted);
        
        console.log(`✅ CAT balance retrieved: ${formattedWithCommas}`);
        
        return {
          formatted: formattedWithCommas,
          raw: { low: balance.low.toString(), high: balance.high.toString() },
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
    const maxRetries = 2;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        console.log(`💎 Fetching STRK balance for ${address} (attempt ${retries + 1}/${maxRetries})`);
        console.log(`🔗 Using STRK contract address: ${STRK_TOKEN_CONFIG.address}`);
        
        const balance = await this.strkContract.balance_of(address);
        
        const formatted = parseTokenAmount(
          balance.low.toString(), 
          balance.high.toString(), 
          STRK_TOKEN_CONFIG.decimals
        );
        
        const formattedWithCommas = formatNumberWithCommas(formatted);
        
        console.log(`✅ STRK balance retrieved: ${formattedWithCommas}`);
        
        return {
          formatted: formattedWithCommas,
          raw: { low: balance.low.toString(), high: balance.high.toString() },
          isRealData: true
        };
      } catch (error) {
        retries++;
        console.error(`❌ Error getting STRK balance (attempt ${retries}):`, error);
        
        if (retries >= maxRetries) {
          const fallbackBalance = process.env.NODE_ENV === 'development' ? '45.75' : '0';
          console.log(`🔄 Using fallback STRK balance: ${fallbackBalance}`);
          
          return {
            formatted: fallbackBalance,
            raw: { low: '0', high: '0' },
            isRealData: false
          };
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
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
      
      const formatted = parseTokenAmount(
        supply.low.toString(), 
        supply.high.toString(), 
        CONTRACT_CONFIG.decimals
      );
      
      const formattedWithCommas = formatNumberWithCommas(formatted);
      
      console.log(`✅ Total supply retrieved: ${formattedWithCommas}`);
      
      return {
        formatted: formattedWithCommas,
        raw: {
          low: supply.low.toString(),
          high: supply.high.toString()
        },
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
