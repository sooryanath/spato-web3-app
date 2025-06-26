
import { ContractResponse } from './types';

export class ContractResponseValidator {
  static validate(response: any, tokenSymbol: string): { low: string; high: string } | null {
    console.log(`🔍 Validating ${tokenSymbol} contract response:`, response);
    console.log(`🔍 Response type: ${typeof response}, isArray: ${Array.isArray(response)}`);
    
    if (!response) {
      console.warn(`⚠️ ${tokenSymbol} response is null/undefined`);
      return null;
    }

    // Handle direct number values (common in mock/test environments)
    if (typeof response === 'number') {
      const value = response.toString();
      console.log(`✅ ${tokenSymbol} response is direct number: ${value}`);
      return { low: value, high: '0' };
    }

    // Handle string values that represent numbers
    if (typeof response === 'string' && !isNaN(Number(response))) {
      console.log(`✅ ${tokenSymbol} response is string number: ${response}`);
      return { low: response, high: '0' };
    }

    // Handle u256 response format (low, high)
    if (response.low !== undefined && response.high !== undefined) {
      console.log(`✅ ${tokenSymbol} response has low/high format`);
      return {
        low: response.low.toString(),
        high: response.high.toString()
      };
    }

    // Handle array format [low, high]
    if (Array.isArray(response) && response.length >= 2) {
      console.log(`✅ ${tokenSymbol} response is array format with length ${response.length}`);
      return {
        low: response[0].toString(),
        high: response[1].toString()
      };
    }

    // Handle array format with single value
    if (Array.isArray(response) && response.length === 1) {
      console.log(`✅ ${tokenSymbol} response is array with single value: ${response[0]}`);
      return {
        low: response[0].toString(),
        high: '0'
      };
    }

    // Handle nested value structure
    if (typeof response === 'object' && response.value !== undefined) {
      console.log(`🔍 ${tokenSymbol} response has nested value structure`);
      if (response.value.low !== undefined && response.value.high !== undefined) {
        return {
          low: response.value.low.toString(),
          high: response.value.high.toString()
        };
      }
      // Handle single nested value
      if (typeof response.value === 'number' || typeof response.value === 'string') {
        return {
          low: response.value.toString(),
          high: '0'
        };
      }
    }

    // Handle BigNumber or similar objects with toString method
    if (response.toString && typeof response.toString === 'function') {
      const stringValue = response.toString();
      if (!isNaN(Number(stringValue))) {
        console.log(`✅ ${tokenSymbol} response converted via toString: ${stringValue}`);
        return {
          low: stringValue,
          high: '0'
        };
      }
    }

    // Handle BigInt values
    if (typeof response === 'bigint') {
      console.log(`✅ ${tokenSymbol} response is BigInt: ${response.toString()}`);
      return {
        low: response.toString(),
        high: '0'
      };
    }

    console.error(`❌ ${tokenSymbol} response format not recognized:`, response);
    return null;
  }
}
