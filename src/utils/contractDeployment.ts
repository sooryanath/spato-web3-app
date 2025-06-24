
import { AccountInterface, Contract, json, RpcProvider } from 'starknet';
import { createProviderWithFailover } from './walletUtils';

// CAT Token Contract Class Hash - This would be obtained after declaring the contract
export const CAT_TOKEN_CLASS_HASH = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'; // Placeholder

export interface DeploymentConfig {
  name: string;
  symbol: string;
  initialSupply: string;
  recipient: string;
}

export interface DeploymentResult {
  contractAddress: string;
  transactionHash: string;
  classHash: string;
}

export class ContractDeployer {
  private account: AccountInterface;
  private provider: RpcProvider;

  constructor(account: AccountInterface, provider: RpcProvider) {
    this.account = account;
    this.provider = provider;
  }

  static async create(account: AccountInterface): Promise<ContractDeployer> {
    const provider = await createProviderWithFailover();
    return new ContractDeployer(account, provider);
  }

  async deployCATToken(config: DeploymentConfig): Promise<DeploymentResult> {
    try {
      console.log('🚀 Deploying CAT Token with config:', config);

      // Convert initial supply to Cairo u256 format
      const supply = BigInt(config.initialSupply) * BigInt(10 ** 18);
      const supplyLow = (supply & BigInt('0xffffffffffffffffffffffffffffffff')).toString();
      const supplyHigh = (supply >> BigInt(128)).toString();

      // Constructor calldata: name, symbol, initial_supply, recipient
      const constructorCalldata = [
        config.name,
        config.symbol,
        supplyLow,
        supplyHigh,
        config.recipient
      ];

      // Deploy the contract
      const deployResponse = await this.account.deployContract({
        classHash: CAT_TOKEN_CLASS_HASH,
        constructorCalldata
      });

      console.log('✅ CAT Token deployment initiated:', deployResponse);

      return {
        contractAddress: deployResponse.contract_address,
        transactionHash: deployResponse.transaction_hash,
        classHash: CAT_TOKEN_CLASS_HASH
      };

    } catch (error) {
      console.error('❌ Error deploying CAT Token:', error);
      throw new Error(`Failed to deploy CAT Token: ${error.message}`);
    }
  }

  async verifyDeployment(contractAddress: string): Promise<boolean> {
    try {
      console.log('🔍 Verifying contract deployment:', contractAddress);
      
      // Try to get contract class hash to verify deployment
      const classHash = await this.provider.getClassHashAt(contractAddress);
      const isDeployed = classHash && classHash !== '0x0';
      
      console.log(`✅ Contract verification result: ${isDeployed ? 'Deployed' : 'Not found'}`);
      return isDeployed;
      
    } catch (error) {
      console.error('❌ Error verifying deployment:', error);
      return false;
    }
  }

  async getContractInfo(contractAddress: string) {
    try {
      const contract = new Contract([], contractAddress, this.provider);
      
      // Get basic contract information
      const info = {
        address: contractAddress,
        isDeployed: await this.verifyDeployment(contractAddress)
      };
      
      console.log('📋 Contract info:', info);
      return info;
      
    } catch (error) {
      console.error('❌ Error getting contract info:', error);
      throw error;
    }
  }
}

// Utility functions for contract deployment
export const formatDeploymentConfig = (
  name: string,
  symbol: string,
  initialSupply: string,
  recipient: string
): DeploymentConfig => ({
  name,
  symbol,
  initialSupply,
  recipient
});

export const validateDeploymentConfig = (config: DeploymentConfig): boolean => {
  if (!config.name || config.name.length === 0) return false;
  if (!config.symbol || config.symbol.length === 0) return false;
  if (!config.initialSupply || parseFloat(config.initialSupply) <= 0) return false;
  if (!config.recipient || !config.recipient.startsWith('0x')) return false;
  return true;
};
