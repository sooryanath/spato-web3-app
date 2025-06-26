
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';
import { Send } from "lucide-react";
import { validateTransferForm } from './TokenTransferValidation';
import { useCompanyDashboard } from '@/contexts/CompanyDashboardContext';
import VendorSelector from './transfer/VendorSelector';
import TokenAmountField from './transfer/TokenAmountField';
import PurposeSelector from './transfer/PurposeSelector';
import NotesField from './transfer/NotesField';
import TransferButton from './transfer/TransferButton';
import ConnectionAlert from './transfer/ConnectionAlert';

const TokenTransferForm = () => {
  const [formData, setFormData] = useState({
    vendor: '',
    amount: '',
    purpose: '',
    notes: ''
  });
  const [isTransferring, setIsTransferring] = useState(false);
  
  const { isConnected, transferTokens } = useWeb3();
  const { toast } = useToast();
  const { addTokenTransfer } = useCompanyDashboard();

  // Using the testnet address for all vendors to test functionality
  const TEST_ADDRESS = '0x02dec0e08e74972df0df86d11089d0bba1e22c87a6c0ede6ffc2c1a2243e3c16';
  
  const vendors = [
    { id: 'vendor1', name: 'ABC Manufacturing Ltd', address: TEST_ADDRESS },
    { id: 'vendor2', name: 'XYZ Logistics Co', address: TEST_ADDRESS },
    { id: 'vendor3', name: 'Tech Solutions Inc', address: TEST_ADDRESS },
    { id: 'vendor4', name: 'Global Supplies Corp', address: TEST_ADDRESS }
  ];

  const transferPurposes = [
    'Raw Materials',
    'Manufacturing Services',
    'Logistics & Shipping',
    'Consulting Services',
    'Equipment Purchase',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validation = validateTransferForm(isConnected, formData, vendors);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    const selectedVendor = vendors.find(v => v.id === formData.vendor)!;
    setIsTransferring(true);

    try {
      // Add to context immediately
      addTokenTransfer({
        vendor: selectedVendor.name,
        amount: formData.amount,
        purpose: formData.purpose,
        txHash: `0x${Date.now().toString(16)}...${Math.random().toString(16).slice(2, 6)}`
      });

      const result = await transferTokens(selectedVendor.address, formData.amount);
      
      toast({
        title: "Transfer Initiated",
        description: `Successfully transferred ${formData.amount} CAT tokens to ${selectedVendor.name}`,
      });

      // Reset form
      setFormData({
        vendor: '',
        amount: '',
        purpose: '',
        notes: ''
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error occurred';
      console.error('❌ Token transfer failed:', error);
      
      toast({
        title: "Transfer Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="w-5 h-5 text-blue-600" />
          <span>Transfer Tokens to Vendor</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <VendorSelector
            value={formData.vendor}
            onChange={(value) => setFormData({...formData, vendor: value})}
            vendors={vendors}
          />

          <TokenAmountField
            value={formData.amount}
            onChange={(value) => setFormData({...formData, amount: value})}
          />

          <PurposeSelector
            value={formData.purpose}
            onChange={(value) => setFormData({...formData, purpose: value})}
            purposes={transferPurposes}
          />

          <NotesField
            value={formData.notes}
            onChange={(value) => setFormData({...formData, notes: value})}
          />

          <TransferButton
            isConnected={isConnected}
            isTransferring={isTransferring}
            onSubmit={() => {}}
          />

          <ConnectionAlert isConnected={isConnected} />
        </form>
      </CardContent>
    </Card>
  );
};

export default TokenTransferForm;
