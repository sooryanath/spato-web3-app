
import { Contract, AccountInterface } from 'starknet';
import { CONTRACT_CONFIG, formatTokenAmount, parseTokenAmount, checkTransactionStatus } from '@/utils/walletUtils';

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

export class TokenService {
  private contract: Contract;
  private account: AccountInterface;

  constructor(account: AccountInterface) {
    this.account = account;
    this.contract = new Contract(CONTRACT_CONFIG.abi, CONTRACT_CONFIG.address, account);
  }

  async mintTokens(recipient: string, amount: string): Promise<TokenMintResult> {
    try {
      console.log(`Minting ${amount} CAT tokens to ${recipient}`);
      
      // Format amount for Cairo u256
      const formattedAmount = formatTokenAmount(amount, CONTRACT_CONFIG.decimals);
      
      // Call mint function
      const result = await this.contract.mint(recipient, formattedAmount);
      
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
      const balance = await this.contract.balance_of(address);
      
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
      console.error('Error getting balance:', error);
      throw this.handleContractError(error);
    }
  }

  async getTotalSupply(): Promise<TokenBalance> {
    try {
      const supply = await this.contract.total_supply();
      
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
      const status = await checkTransactionStatus(this.account.provider, txHash);
      
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

export const createTokenService = (account: AccountInterface): TokenService => {
  return new TokenService(account);
};
