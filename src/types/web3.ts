
import { AccountInterface } from 'starknet';
import { WalletInfo } from '@/utils/walletUtils';
import { TokenService, TokenMintResult, MultiTokenBalance } from '@/services/tokenService';

export interface Web3ContextType {
  account: AccountInterface | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string;
  strkBalance: string;
  chainId: string;
  availableWallets: WalletInfo[];
  connectWallet: (walletId?: string) => Promise<void>;
  disconnectWallet: () => void;
  issueTokens: (recipient: string, amount: string) => Promise<TokenMintResult>;
  transferTokens: (recipient: string, amount: string) => Promise<TokenMintResult>;
  isIssuing: boolean;
  walletAddress: string;
  tokenService: TokenService | null;
  refreshBalance: () => Promise<void>;
  lastMintResult: TokenMintResult | null;
}

export interface WalletState {
  account: AccountInterface | null;
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string;
  chainId: string;
  tokenService: TokenService | null;
}

export interface TokenState {
  balance: string;
  strkBalance: string;
  isIssuing: boolean;
  lastMintResult: TokenMintResult | null;
}
