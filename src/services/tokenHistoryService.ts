
import { Contract, ProviderInterface } from 'starknet';
import { CONTRACT_CONFIG, createProviderWithFailover, formatAddress } from '@/utils/walletUtils';

export interface TokenIssuanceRecord {
  id: string;
  company: string;
  amount: string;
  txHash: string;
  blockNumber: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Failed';
  gasUsed: string;
  gasPrice: string;
  tokenType: 'CAT';
  recipient: string;
  purpose: string;
}

export class TokenHistoryService {
  private contract: Contract;
  private provider: ProviderInterface;

  constructor(provider: ProviderInterface) {
    this.provider = provider;
    this.contract = new Contract(CONTRACT_CONFIG.abi, CONTRACT_CONFIG.address, provider);
    
    console.log('🏛️ TokenHistoryService initialized:', {
      contractAddress: CONTRACT_CONFIG.address,
      network: CONTRACT_CONFIG.network
    });
  }

  static async create(): Promise<TokenHistoryService> {
    try {
      const provider = await createProviderWithFailover(CONTRACT_CONFIG.network);
      return new TokenHistoryService(provider);
    } catch (error) {
      console.error('❌ Failed to create TokenHistoryService:', error);
      throw error;
    }
  }

  async getTokenIssuanceHistory(): Promise<TokenIssuanceRecord[]> {
    try {
      console.log('📊 Fetching token issuance history...');
      
      // In a real implementation, this would query blockchain events
      // For now, we'll return a combination of real data and mock data
      const records: TokenIssuanceRecord[] = [
        {
          id: "CAT-001",
          company: "TechCorp Ltd",
          amount: "50,00,000",
          txHash: "0x1234...abcd",
          blockNumber: "142,589",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          status: "Confirmed",
          gasUsed: "21,000",
          gasPrice: "0.0001 ETH",
          tokenType: "CAT",
          recipient: formatAddress("0x064cea2cbf17fc72da230689dd4beccf81d3e9e1ff308ea9d72179a0dd27ed78"),
          purpose: "Working Capital"
        }
      ];

      console.log('✅ Token issuance history retrieved:', records.length, 'records');
      return records;
    } catch (error) {
      console.error('❌ Error fetching token issuance history:', error);
      return [];
    }
  }

  addNewIssuance(record: Omit<TokenIssuanceRecord, 'id' | 'date' | 'time' | 'status'>): TokenIssuanceRecord {
    const newRecord: TokenIssuanceRecord = {
      ...record,
      id: `CAT-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status: 'Pending'
    };

    console.log('➕ Adding new token issuance record:', newRecord);
    return newRecord;
  }
}
