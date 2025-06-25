
export const validateStarknetAddress = (address: string): { isValid: boolean; error?: string } => {
  if (!address) {
    return { isValid: false, error: 'Address is required' };
  }

  if (!address.startsWith('0x')) {
    return { isValid: false, error: 'Address must start with 0x' };
  }

  if (address.length < 60 || address.length > 70) {
    return { isValid: false, error: 'Address length must be between 60-70 characters' };
  }

  if (!/^0x[0-9a-fA-F]+$/.test(address)) {
    return { isValid: false, error: 'Address contains invalid characters' };
  }

  return { isValid: true };
};

export const validateTokenAmount = (amount: string): { isValid: boolean; error?: string } => {
  if (!amount) {
    return { isValid: false, error: 'Amount is required' };
  }

  const num = parseFloat(amount);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }

  if (num <= 0) {
    return { isValid: false, error: 'Amount must be greater than 0' };
  }

  if (num > 1000000) {
    return { isValid: false, error: 'Amount cannot exceed 1,000,000 tokens' };
  }

  return { isValid: true };
};

export const formatDebugMessage = (level: 'info' | 'success' | 'error' | 'warning', message: string): string => {
  const timestamp = new Date().toLocaleTimeString();
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  
  return `[${timestamp}] ${icons[level]} ${message}`;
};
