
export class TransactionExecutor {
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 3,
    delayMs: number = 2000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 ${operationName} - Attempt ${attempt}/${maxRetries}`);
        const result = await operation();
        console.log(`✅ ${operationName} - Success on attempt ${attempt}`);
        return result;
      } catch (error: any) {
        lastError = error;
        console.error(`❌ ${operationName} - Failed on attempt ${attempt}:`, error.message);
        
        if (attempt < maxRetries) {
          const delay = delayMs * attempt; // Exponential backoff
          console.log(`⏳ ${operationName} - Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }
}
