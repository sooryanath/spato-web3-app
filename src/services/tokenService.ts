
import { Contract, AccountInterface, ProviderInterface } from 'starknet';
import { CONTRACT_CONFIG, STRK_TOKEN_CONFIG, formatTokenAmount, parseTokenAmount, checkTransactionStatus } from '@/utils/walletUtils';

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
  }

  async mintTokens(recipient: string, amount: string): Promise<TokenMintResult> {
    try {
      console.log(`Minting ${amount} CAT tokens to ${recipient}`);
      
      // Format amount for Cairo u256
      const formattedAmount = formatTokenAmount(amount, CONTRACT_CONFIG.decimals);
      
      // Call mint function
      const result = await this.catContract.mint(recipient, formattedAmount);
      
      console.log('Mint transaction submitted:', result.transaction_hash);
      
      // Return initial result
      const mintResult: TokenMintResult = {
        transactionHash: result.transaction_hash,
        status: 'pending'
      };

      // Monitor transaction status in background
      this.monitorTransaction(result.transaction_hash, mintResult);
      
      return mintResult;
      
    } catch (error) {
      console.error('Error minting tokens:', error);
      throw this.handleContractError(error);
    }
  }

  async getBalance(address: string): Promise<TokenBalance> {
    try {
      const balance = await this.catContract.balance_of(address);
      
      const formatted = parseTokenAmount(
        balance.low.toString(), 
        balance.high.toString(), 
        CONTRACT_CONFIG.decimals
      );
      
      return {
        formatted,
        raw: {
          low: balance.low.toString(),
          high: balance.high.toString()
        }
      };
    } catch (error) {
      console.error('Error getting CAT balance:', error);
      throw this.handleContractError(error);
    }
  }

  async getStrkBalance(address: string): Promise<TokenBalance> {
    try {
      const balance = await this.strkContract.balance_of(address);
      
      const formatted = parseTokenAmount(
        balance.low.toString(), 
        balance.high.toString(), 
        STRK_TOKEN_CONFIG.decimals
      );
      
      return {
        formatted,
        raw: {
          low: balance.low.toString(),
          high: balance.high.toString()
        }
      };
    } catch (error) {
      console.error('Error getting STRK balance:', error);
      // Return zero balance if STRK balance fetch fails (common for test wallets)
      return {
        formatted: '0',
        raw: { low: '0', high: '0' }
      };
    }
  }

  async getAllBalances(address: string): Promise<MultiTokenBalance> {
    try {
      const [catBalance, strkBalance] = await Promise.all([
        this.getBalance(address),
        this.getStrkBalance(address)
      ]);

      return {
        cat: catBalance,
        strk: strkBalance
      };
    } catch (error) {
      console.error('Error getting all balances:', error);
      // Return default balances on error
      return {
        cat: { formatted: '0', raw: { low: '0', high: '0' } },
        strk: { formatted: '0', raw: { low: '0', high: '0' } }
      };
    }
  }

  async getTotalSupply(): Promise<TokenBalance> {
    try {
      const supply = await this.catContract.total_supply();
      
      const formatted = parseTokenAmount(
        supply.low.toString(), 
        supply.high.toString(), 
        CONTRACT_CONFIG.decimals
      );
      
      return {
        formatted,
        raw: {
          low: supply.low.toString(),
          high: supply.high.toString()
        }
      };
    } catch (error) {
      console.error('Error getting total supply:', error);
      throw this.handleContractError(error);
    }
  }

  private async monitorTransaction(txHash: string, result: TokenMintResult): Promise<void> {
    try {
      const status = await checkTransactionStatus(this.provider, txHash);
      
      result.status = status.status === 'SUCCEEDED' ? 'confirmed' : 'failed';
      result.blockNumber = status.blockNumber;
      result.blockHash = status.blockHash;
      
      console.log(`Transaction ${txHash} ${result.status}`, status);
    } catch (error) {
      console.error('Error monitoring transaction:', error);
      result.status = 'failed';
    }
  }

  private handleContractError(error: any): Error {
    if (error.message?.includes('insufficient balance')) {
      return new Error('Insufficient balance to perform this transaction');
    }
    
    if (error.message?.includes('unauthorized')) {
      return new Error('Unauthorized to mint tokens - check contract permissions');
    }
    
    if (error.message?.includes('invalid recipient')) {
      return new Error('Invalid recipient address provided');
    }
    
    // Generic error handling
    return new Error(`Contract operation failed: ${error.message || 'Unknown error'}`);
  }
}

export const createTokenService = (account: AccountInterface, provider: ProviderInterface): TokenService => {
  return new TokenService(account, provider);
};
