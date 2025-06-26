
// Re-export everything from the refactored token service to maintain existing imports
export { TokenService } from './token/tokenService';
export type { TokenMintResult, TokenBalance, MultiTokenBalance } from './token/types';
import { TokenService } from './token/tokenService';
import { AccountInterface, ProviderInterface } from 'starknet';

export const createTokenService = async (account: AccountInterface, provider?: ProviderInterface): Promise<TokenService> => {
  console.log('🏭 Creating enhanced TokenService instance');
  
  if (provider) {
    return new TokenService(account, provider);
  }
  
  return await TokenService.createWithFailover(account);
};
