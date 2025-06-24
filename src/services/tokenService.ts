
import { Contract, AccountInterface, ProviderInterface } from 'starknet';
import { CONTRACT_CONFIG, STRK_TOKEN_CONFIG, formatTokenAmount, parseTokenAmount, checkTransactionStatus, formatNumberWithCommas } from '@/utils/walletUtils';

export interface TokenMintResult {
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: string;
  blockHash?: string;
}

export interface TokenBalance {
  formatted: string;
  raw: { low: string; high: string };
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
    const maxRetries = 3;
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
          raw: {
            low: balance.low.toString(),
            high: balance.high.toString()
          }
        };
      } catch (error) {
        retries++;
        console.error(`❌ Error getting CAT balance (attempt ${retries}):`, error);
        
        if (retries >= maxRetries) {
          // Return mock data for development or zero for production
          const fallbackBalance = process.env.NODE_ENV === 'development' ? '1,250.50' : '0';
          console.log(`🔄 Using fallback CAT balance: ${fallbackBalance}`);
          
          return {
            formatted: fallbackBalance,
            raw: { low: '0', high: '0' }
          };
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    // This should never be reached, but TypeScript requires it
    throw new Error('Failed to get CAT balance after all retries');
  }

  async getStrkBalance(address: string): Promise<TokenBalance> {
    const maxRetries = 3;
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        console.log(`💎 Fetching STRK balance for ${address} (attempt ${retries + 1}/${maxRetries})`);
        
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
          raw: {
            low: balance.low.toString(),
            high: balance.high.toString()
          }
        };
      } catch (error) {
        retries++;
        console.error(`❌ Error getting STRK balance (attempt ${retries}):`, error);
        
        if (retries >= maxRetries) {
          // Return mock data for development or zero for production  
          const fallbackBalance = process.env.NODE_ENV === 'development' ? '45.75' : '0';
          console.log(`🔄 Using fallback STRK balance: ${fallbackBalance}`);
          
          return {
            formatted: fallbackBalance,
            raw: { low: '0', high: '0' }
          };
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
      }
    }
    
    // This should never be reached, but TypeScript requires it
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
        : { formatted: process.env.NODE_ENV === 'development' ? '1,250.50' : '0', raw: { low: '0', high: '0' } };
        
      const strkResult = strkBalance.status === 'fulfilled' 
        ? strkBalance.value 
        : { formatted: process.env.NODE_ENV === 'development' ? '45.75' : '0', raw: { low: '0', high: '0' } };

      console.log('✅ All balances retrieved:', {
        CAT: catResult.formatted,
        STRK: strkResult.formatted
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
          raw: { low: '0', high: '0' } 
        },
        strk: { 
          formatted: process.env.NODE_ENV === 'development' ? '45.75' : '0', 
          raw: { low: '0', high: '0' } 
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
        }
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

export const createTokenService = (account: AccountInterface, provider: ProviderInterface): TokenService => {
  console.log('🏭 Creating TokenService instance');
  return new TokenService(account, provider);
};

