/**
 * Address normalization utilities for consistent wallet address handling
 */

/**
 * Normalizes a StarkNet address by removing leading zeros and ensuring consistent format
 * @param address - The address to normalize
 * @returns Normalized address without leading zeros
 */
export const normalizeAddress = (address: string): string => {
  if (!address) return '';
  
  // Remove '0x' prefix if present
  const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
  
  // Remove leading zeros but keep at least one character
  const withoutLeadingZeros = cleanAddress.replace(/^0+/, '') || '0';
  
  // Add back '0x' prefix
  return `0x${withoutLeadingZeros}`;
};

/**
 * Compares two addresses for equality after normalization
 * @param address1 - First address to compare
 * @param address2 - Second address to compare
 * @returns True if addresses are equal after normalization
 */
export const addressesEqual = (address1: string, address2: string): boolean => {
  if (!address1 || !address2) return false;
  
  const normalized1 = normalizeAddress(address1).toLowerCase();
  const normalized2 = normalizeAddress(address2).toLowerCase();
  
  console.log(`🔍 Address comparison:`, {
    original1: address1,
    original2: address2,
    normalized1,
    normalized2,
    equal: normalized1 === normalized2
  });
  
  return normalized1 === normalized2;
};

/**
 * Formats an address for display purposes
 * @param address - Address to format
 * @param length - Number of characters to show from start and end (default: 6)
 * @returns Formatted address string
 */
export const formatAddressForDisplay = (address: string, length: number = 6): string => {
  if (!address) return '';
  
  const normalized = normalizeAddress(address);
  
  if (normalized.length <= length * 2 + 2) {
    return normalized;
  }
  
  return `${normalized.slice(0, length + 2)}...${normalized.slice(-length)}`;
};
