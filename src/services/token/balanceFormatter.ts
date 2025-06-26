
import { TokenBalance } from './types';
import { parseTokenAmount, formatNumberWithCommas } from '@/utils/walletUtils';

export class BalanceFormatter {
  static parseBalanceToNumber(formatted: string): number {
    // Remove commas and any currency symbols, then parse as float
    const cleanString = formatted.replace(/[,₹$]/g, '').trim();
    const parsed = parseFloat(cleanString);
    console.log(`🔢 Balance parsing: "${formatted}" -> "${cleanString}" -> ${parsed}`);
    return isNaN(parsed) ? 0 : parsed;
  }

  static createTokenBalance(
    validatedBalance: { low: string; high: string },
    decimals: number,
    tokenSymbol: string,
    isRealData: boolean = true
  ): TokenBalance {
    const formatted = parseTokenAmount(
      validatedBalance.low, 
      validatedBalance.high, 
      decimals
    );
    
    const formattedWithCommas = formatNumberWithCommas(formatted);
    const numericValue = this.parseBalanceToNumber(formattedWithCommas);
    
    console.log(`✅ ${tokenSymbol} balance processed: ${formattedWithCommas} (numeric: ${numericValue})`);
    
    return {
      formatted: formattedWithCommas,
      raw: validatedBalance,
      isRealData,
      numericValue
    };
  }

  static createFallbackBalance(tokenSymbol: string, mockValue: string): TokenBalance {
    const numericValue = this.parseBalanceToNumber(mockValue);
    const rawValue = process.env.NODE_ENV === 'development' 
      ? (tokenSymbol === 'CAT' ? '1250500000000000000000' : '45750000000000000000')
      : '0';
    
    console.log(`🔄 Creating fallback ${tokenSymbol} balance:`, {
      formatted: mockValue,
      numericValue,
      rawValue,
      environment: process.env.NODE_ENV
    });
    
    return {
      formatted: mockValue,
      raw: { low: rawValue, high: '0' },
      isRealData: false,
      numericValue
    };
  }
}
