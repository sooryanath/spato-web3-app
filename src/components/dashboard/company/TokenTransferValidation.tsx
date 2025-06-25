
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateStarknetAddress = (address: string): boolean => {
  // Basic Starknet address validation
  if (!address) return false;
  if (!address.startsWith('0x')) return false;
  if (address.length < 60 || address.length > 70) return false;
  if (!/^0x[0-9a-fA-F]+$/.test(address)) return false;
  return true;
};

export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num <= 1000000; // Max 1M tokens per transfer
};

export const validateTransferForm = (
  isConnected: boolean,
  formData: { vendor: string; amount: string; purpose: string },
  vendors: Array<{ id: string; name: string; address: string }>
): ValidationResult => {
  if (!isConnected) {
    return {
      isValid: false,
      error: "Please connect your wallet to transfer tokens"
    };
  }

  if (!formData.vendor || !formData.amount || !formData.purpose) {
    return {
      isValid: false,
      error: "Please fill in all required fields"
    };
  }

  if (!validateAmount(formData.amount)) {
    return {
      isValid: false,
      error: "Please enter a valid amount between 0.01 and 1,000,000"
    };
  }

  const selectedVendor = vendors.find(v => v.id === formData.vendor);
  if (!selectedVendor) {
    return {
      isValid: false,
      error: "Please select a valid vendor"
    };
  }

  if (!validateStarknetAddress(selectedVendor.address)) {
    return {
      isValid: false,
      error: "Vendor address is not a valid Starknet address"
    };
  }

  return { isValid: true };
};
