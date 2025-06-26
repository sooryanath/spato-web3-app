
export interface TokenMintResult {
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: string;
  blockHash?: string;
  step?: 'add_bank' | 'mint_to_anchor' | 'transfer' | 'completed';
}

export interface TokenBalance {
  formatted: string;
  raw: { low: string; high: string };
  isRealData: boolean;
  numericValue: number;
}

export interface MultiTokenBalance {
  cat: TokenBalance;
  strk: TokenBalance;
}

export interface ContractResponse {
  low?: string | number;
  high?: string | number;
  value?: any;
  toString?: () => string;
}
