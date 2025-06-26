
export class TokenServiceErrorHandler {
  static handleContractError(error: any): Error {
    console.error('🔧 Processing contract error:', error);
    
    // Enhanced error mapping
    if (error.message?.includes('ENTRYPOINT_NOT_FOUND')) {
      return new Error('Contract function not found. The contract may not be deployed correctly or the ABI is outdated.');
    }
    
    if (error.message?.includes('Bank already exists')) {
      return new Error('Bank is already authorized. Retrying mint operation...');
    }
    
    if (error.message?.includes('Caller is not authorized')) {
      return new Error('This wallet is not authorized to mint tokens. Please contact the contract administrator.');
    }
    
    if (error.message?.includes('insufficient balance')) {
      return new Error('Insufficient balance to perform this transaction. Please check your wallet balance.');
    }
    
    if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
      return new Error('Network connection error. Please check your internet connection and try again.');
    }
    
    if (error.message?.includes('User rejected') || error.message?.includes('user rejected')) {
      return new Error('Transaction was rejected by user');
    }
    
    if (error.message?.includes('Invalid address')) {
      return new Error('The recipient address is not valid. Please check the address format.');
    }
    
    if (error.message?.includes('timeout')) {
      return new Error('Transaction timed out. Please try again with a higher gas fee.');
    }
    
    return new Error(`Transaction failed: ${error.message || 'Unknown error occurred'}`);
  }
}
