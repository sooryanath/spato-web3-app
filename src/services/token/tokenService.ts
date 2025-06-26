
import { Contract, AccountInterface, ProviderInterface } from 'starknet';
import { CONTRACT_CONFIG, STRK_TOKEN_CONFIG, formatTokenAmount, checkTransactionStatus, createProviderWithFailover } from '@/utils/walletUtils';
import { TokenMintResult, TokenBalance, MultiTokenBalance } from './types';
import { ContractResponseValidator } from './contractResponseValidator';
import { BalanceFormatter } from './balanceFormatter';
import { TransactionExecutor } from './transactionExecutor';
import { TokenServiceErrorHandler } from './errorHandler';

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

  async transferTokens(recipient: string, amount: string): Promise<TokenMintResult> {
    console.log(`💸 Starting token transfer: ${amount} CAT to ${recipient}`);
    
    // Enhanced pre-flight checks
    if (!recipient || !amount) {
      throw new Error('Recipient address and amount are required');
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    // Check user balance before transfer
    const currentBalance = await this.getBalance(this.account.address);
    const availableBalance = currentBalance.numericValue;
    
    console.log(`💰 Balance check: Available ${availableBalance}, Requesting ${numAmount}`);
    
    if (numAmount > availableBalance) {
      throw new Error(`Insufficient balance. Available: ${availableBalance}, Requested: ${numAmount}`);
    }

    try {
      // Check if transfer function exists
      if (!this.catContract.transfer) {
        throw new Error('Transfer function not available in contract');
      }

      console.log('✅ Transfer function found in contract');

      // Execute transfer with retry logic
      const transferResult = await TransactionExecutor.executeWithRetry(
        async () => {
          console.log(`💸 Executing transfer to ${recipient}...`);
          const formattedAmount = formatTokenAmount(amount, CONTRACT_CONFIG.decimals);
          console.log('🔢 Formatted amount for transfer:', formattedAmount);
          
          const result = await this.catContract.transfer(recipient, formattedAmount);
          console.log('✅ Transfer executed successfully:', result.transaction_hash);
          return result;
        },
        'Token Transfer Operation',
        3
      );
      
      const result: TokenMintResult = {
        transactionHash: transferResult.transaction_hash,
        status: 'pending',
        step: 'transfer'
      };

      // Monitor transaction status in background
      this.monitorTransaction(transferResult.transaction_hash, result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Token transfer failed:', error);
      throw TokenServiceErrorHandler.handleContractError(error);
    }
  }

  async mintTokens(recipient: string, amount: string): Promise<TokenMintResult> {
    console.log(`🪙 Starting enhanced token minting: ${amount} CAT to ${recipient}`);
    
    // Enhanced pre-flight checks
    if (!recipient || !amount) {
      throw new Error('Recipient address and amount are required');
    }
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    try {
      // Step 1: Add bank with retry logic
      await TransactionExecutor.executeWithRetry(
        async () => {
          console.log('📝 Adding bank to authorized list...');
          const bankAddress = this.account.address;
          
          try {
            const addBankResult = await this.catContract.add_bank(bankAddress);
            console.log('✅ Bank added successfully:', addBankResult.transaction_hash);
            return addBankResult;
          } catch (error: any) {
            if (error.message?.includes('Bank already exists')) {
              console.log('✅ Bank already authorized');
              return { transaction_hash: 'already_exists' };
            }
            throw error;
          }
        },
        'Add Bank Operation',
        2
      );
      
      // Wait for bank authorization to be processed
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Step 2: Mint tokens with retry logic
      const mintResult = await TransactionExecutor.executeWithRetry(
        async () => {
          console.log('🪙 Minting tokens to recipient...');
          const formattedAmount = formatTokenAmount(amount, CONTRACT_CONFIG.decimals);
          console.log('🔢 Formatted amount for contract:', formattedAmount);
          
          const result = await this.catContract.mint_to_anchor(recipient, formattedAmount);
          console.log('✅ Tokens minted successfully:', result.transaction_hash);
          return result;
        },
        'Mint Tokens Operation',
        3
      );
      
      const result: TokenMintResult = {
        transactionHash: mintResult.transaction_hash,
        status: 'pending',
        step: 'completed'
      };

      // Monitor transaction status in background
      this.monitorTransaction(mintResult.transaction_hash, result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Enhanced minting process failed:', error);
      throw TokenServiceErrorHandler.handleContractError(error);
    }
  }

  async getBalance(address: string): Promise<TokenBalance> {
    console.log(`💰 Fetching CAT balance for ${address}`);
    
    try {
      const balance = await TransactionExecutor.executeWithRetry(
        async () => {
          console.log('📞 Calling balance_of function...');
          
          if (!this.catContract.balance_of) {
            throw new Error('balance_of function not found in contract');
          }
          
          const result = await this.catContract.balance_of(address);
          console.log('🔍 Raw balance response:', result);
          
          return result;
        },
        'Get CAT Balance',
        2
      );
      
      const validatedBalance = ContractResponseValidator.validate(balance, 'CAT');
      if (!validatedBalance) {
        console.warn('⚠️ Invalid CAT balance response, trying alternative parsing...');
        
        if (balance !== null && balance !== undefined) {
          const fallbackValue = String(balance);
          if (!isNaN(Number(fallbackValue))) {
            console.log(`🔄 Using fallback parsing: ${fallbackValue}`);
            return BalanceFormatter.createTokenBalance(
              { low: fallbackValue, high: '0' },
              CONTRACT_CONFIG.decimals,
              'CAT'
            );
          }
        }
        
        throw new Error('Unable to parse CAT balance response');
      }
      
      return BalanceFormatter.createTokenBalance(
        validatedBalance,
        CONTRACT_CONFIG.decimals,
        'CAT'
      );
    } catch (error) {
      console.error(`❌ Error getting CAT balance:`, error);
      
      const mockBalance = process.env.NODE_ENV === 'development' ? '1,250.50' : '0';
      console.log(`🔄 Using ${process.env.NODE_ENV === 'development' ? 'mock' : 'fallback'} CAT balance: ${mockBalance}`);
      
      return BalanceFormatter.createFallbackBalance('CAT', mockBalance);
    }
  }

  async getStrkBalance(address: string): Promise<TokenBalance> {
    console.log(`💎 Fetching STRK balance for ${address}`);
    
    try {
      const balance = await TransactionExecutor.executeWithRetry(
        async () => {
          console.log('📞 Calling STRK balance_of function...');
          const result = await this.strkContract.balance_of(address);
          console.log('🔍 Raw STRK balance response:', result);
          return result;
        },
        'Get STRK Balance',
        2
      );
      
      const validatedBalance = ContractResponseValidator.validate(balance, 'STRK');
      if (!validatedBalance) {
        console.warn('⚠️ Invalid STRK balance response, trying alternative parsing...');
        
        if (balance !== null && balance !== undefined) {
          const fallbackValue = String(balance);
          if (!isNaN(Number(fallbackValue))) {
            console.log(`🔄 Using STRK fallback parsing: ${fallbackValue}`);
            return BalanceFormatter.createTokenBalance(
              { low: fallbackValue, high: '0' },
              STRK_TOKEN_CONFIG.decimals,
              'STRK'
            );
          }
        }
        
        throw new Error('Unable to parse STRK balance response');
      }
      
      return BalanceFormatter.createTokenBalance(
        validatedBalance,
        STRK_TOKEN_CONFIG.decimals,
        'STRK'
      );
    } catch (error) {
      console.error(`❌ Error getting STRK balance:`, error);
      
      const mockBalance = process.env.NODE_ENV === 'development' ? '45.75' : '0';
      console.log(`🔄 Using ${process.env.NODE_ENV === 'development' ? 'mock' : 'fallback'} STRK balance: ${mockBalance}`);
      
      return BalanceFormatter.createFallbackBalance('STRK', mockBalance);
    }
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
        : BalanceFormatter.createFallbackBalance('CAT', process.env.NODE_ENV === 'development' ? '1,250.50' : '0');
        
      const strkResult = strkBalance.status === 'fulfilled' 
        ? strkBalance.value 
        : BalanceFormatter.createFallbackBalance('STRK', process.env.NODE_ENV === 'development' ? '45.75' : '0');

      console.log('✅ All balances retrieved:', {
        CAT: `${catResult.formatted} (${catResult.isRealData ? 'real' : 'fallback'}, numeric: ${catResult.numericValue})`,
        STRK: `${strkResult.formatted} (${strkResult.isRealData ? 'real' : 'fallback'}, numeric: ${strkResult.numericValue})`
      });

      return {
        cat: catResult,
        strk: strkResult
      };
    } catch (error) {
      console.error('❌ Error getting all balances:', error);
      
      return {
        cat: BalanceFormatter.createFallbackBalance('CAT', process.env.NODE_ENV === 'development' ? '1,250.50' : '0'),
        strk: BalanceFormatter.createFallbackBalance('STRK', process.env.NODE_ENV === 'development' ? '45.75' : '0')
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
      
      const validatedSupply = ContractResponseValidator.validate(supply, 'CAT Supply');
      if (!validatedSupply) {
        throw new Error('Invalid total supply response format');
      }
      
      return BalanceFormatter.createTokenBalance(
        validatedSupply,
        CONTRACT_CONFIG.decimals,
        'CAT Supply'
      );
    } catch (error) {
      console.error('❌ Error getting total supply:', error);
      throw TokenServiceErrorHandler.handleContractError(error);
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
}
