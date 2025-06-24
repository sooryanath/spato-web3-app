
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

  static async createWithFailover(account: AccountInterface): Promise<TokenService> {
    try {
      const enhancedProvider = await createProviderWithFailover(CONTRACT_CONFIG.network);
      return new TokenService(account, enhancedProvider);
    } catch (error) {
      console.error('❌ Failed to create enhanced provider, using fallback:', error);
      const fallbackProvider = await createProviderWithFailover(CONTRACT_CONFIG.network);
      return new TokenService(account, fallbackProvider);
    }
  }

  private validateContractResponse(response: any, tokenSymbol: string): { low: string; high: string } | null {
    console.log(`🔍 Validating ${tokenSymbol} contract response:`, response);
    
    if (!response) {
      console.warn(`⚠️ ${tokenSymbol} response is null/undefined`);
      return null;
    }

    // Handle u256 response format (low, high)
    if (response.low !== undefined && response.high !== undefined) {
      return {
        low: response.low.toString(),
        high: response.high.toString()
      };
    }

    // Handle array format [low, high]
    if (Array.isArray(response) && response.length === 2) {
      return {
        low: response[0].toString(),
        high: response[1].toString()
      };
    }

    // Handle nested value structure
    if (typeof response === 'object' && response.value) {
      if (response.value.low !== undefined && response.value.high !== undefined) {
        return {
          low: response.value.low.toString(),
          high: response.value.high.toString()
        };
      }
    }

    // Handle single value (treat as low with high = 0)
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
      
      // Format amount for Cairo u256
      const formattedAmount = formatTokenAmount(amount, CONTRACT_CONFIG.decimals);
      console.log('🔢 Formatted amount for contract:', formattedAmount);
      
      // Try different mint function names to handle ABI mismatches
      const mintFunctions = ['mint', 'Mint', 'mint_tokens', 'mintTokens'];
      let result;
      let usedFunction = '';
      
      for (const functionName of mintFunctions) {
        try {
          console.log(`📞 Attempting to call ${functionName} function...`);
          
          if (this.catContract[functionName]) {
            result = await this.catContract[functionName](recipient, formattedAmount);
            usedFunction = functionName;
            console.log(`✅ Successfully called ${functionName} function`);
            break;
          } else {
            console.log(`⚠️ Function ${functionName} not found in contract`);
          }
        } catch (error) {
          console.error(`❌ Error calling ${functionName}:`, error);
          
          // If it's the last function to try, re-throw the error
          if (functionName === mintFunctions[mintFunctions.length - 1]) {
            throw error;
          }
          continue;
        }
      }
      
      if (!result) {
        throw new Error('No valid mint function found in contract. Available functions may not match the ABI.');
      }
      
      console.log(`✅ Mint transaction submitted using ${usedFunction}:`, result.transaction_hash);
      
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
        
        // Try different balance function names
        const balanceFunctions = ['balance_of', 'balanceOf', 'getBalance', 'Balance'];
        let balance;
        let usedFunction = '';
        
        for (const functionName of balanceFunctions) {
          try {
            if (this.catContract[functionName]) {
              console.log(`📞 Attempting to call ${functionName} function...`);
              balance = await this.catContract[functionName](address);
              usedFunction = functionName;
              console.log(`✅ Successfully called ${functionName} function`);
              break;
            } else {
              console.log(`⚠️ Function ${functionName} not found in contract`);
            }
          } catch (error) {
            console.error(`❌ Error calling ${functionName}:`, error);
            continue;
          }
        }
        
        if (!balance) {
          throw new Error('No valid balance function found in contract');
        }
        
        console.log(`🔍 Raw CAT balance response from ${usedFunction}:`, balance);
        
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
          const fallbackBalance = '0';
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
        
        const balance = await this.strkContract.balance_of(address);
        console.log('🔍 Raw STRK balance response:', balance);
        
        const validatedBalance = this.validateContractResponse(balance, 'STRK');
        if (!validatedBalance) {
          throw new Error('Invalid STRK balance response format');
        }
        
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
        
        if (retries >= maxRetries) {
          const fallbackBalance = '0';
          console.log(`🔄 Using fallback STRK balance: ${fallbackBalance}`);
          
          return {
            formatted: fallbackBalance,
            raw: { low: '0', high: '0' },
            isRealData: false
          };
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500 * retries));
      }
    }
    
    throw new Error('Failed to get STRK balance after all retries');
  }

  async getAllBalances(address: string): Promise<MultiTokenBalance> {
    try {
      console.log(`📊 Fetching all balances for ${address}`);
      
      const [catBalance, strkBalance] = await Promise.allSettled([
        this.getBalance(address),
        this.getStrkBalance(address)
      ]);

      const catResult = catBalance.status === 'fulfilled' 
        ? catBalance.value 
        : { formatted: '0', raw: { low: '0', high: '0' }, isRealData: false };
        
      const strkResult = strkBalance.status === 'fulfilled' 
        ? strkBalance.value 
        : { formatted: '0', raw: { low: '0', high: '0' }, isRealData: false };

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
      
      return {
        cat: { formatted: '0', raw: { low: '0', high: '0' }, isRealData: false },
        strk: { formatted: '0', raw: { low: '0', high: '0' }, isRealData: false }
      };
    }
  }

  async getTotalSupply(): Promise<TokenBalance> {
    try {
      console.log('📈 Fetching CAT total supply');
      
      // Try different total supply function names
      const supplyFunctions = ['total_supply', 'totalSupply', 'getTotalSupply', 'TotalSupply'];
      let supply;
      let usedFunction = '';
      
      for (const functionName of supplyFunctions) {
        try {
          if (this.catContract[functionName]) {
            console.log(`📞 Attempting to call ${functionName} function...`);
            supply = await this.catContract[functionName]();
            usedFunction = functionName;
            console.log(`✅ Successfully called ${functionName} function`);
            break;
          } else {
            console.log(`⚠️ Function ${functionName} not found in contract`);
          }
        } catch (error) {
          console.error(`❌ Error calling ${functionName}:`, error);
          continue;
        }
      }
      
      if (!supply) {
        throw new Error('No valid total supply function found in contract');
      }
      
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
      
      console.log(`✅ Total supply retrieved using ${usedFunction}: ${formattedWithCommas}`);
      
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
    
    if (error.message?.includes('ENTRYPOINT_NOT_FOUND')) {
      return new Error('Contract function not found - the contract ABI may not match the deployed contract. Please check the contract implementation.');
    }
    
    if (error.message?.includes('response.flat is not a function')) {
      return new Error('Contract response format error - the ABI definition may not match the actual contract methods.');
    }
    
    if (error.message?.includes('insufficient balance')) {
      return new Error('Insufficient balance to perform this transaction');
    }
    
    if (error.message?.includes('unauthorized') || error.message?.includes('caller is not the owner')) {
      return new Error('Unauthorized to mint tokens - check contract permissions');
    }
    
    if (error.message?.includes('invalid recipient')) {
      return new Error('Invalid recipient address provided');
    }
    
    if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
      return new Error('Network connection error - please check your internet connection');
    }
    
    if (error.message?.includes('User rejected') || error.message?.includes('user rejected')) {
      return new Error('Transaction was rejected by user');
    }
    
    return new Error(`Contract operation failed: ${error.message || 'Unknown error'}`);
  }
}

export const createTokenService = async (account: AccountInterface, provider?: ProviderInterface): Promise<TokenService> => {
  console.log('🏭 Creating TokenService instance');
  
  if (provider) {
    return new TokenService(account, provider);
  }
  
  return await TokenService.createWithFailover(account);
};
