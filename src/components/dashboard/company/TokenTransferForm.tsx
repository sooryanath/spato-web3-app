
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2, AlertTriangle } from "lucide-react";

const TokenTransferForm = () => {
  const [formData, setFormData] = useState({
    vendor: '',
    amount: '',
    purpose: '',
    notes: ''
  });
  const [isTransferring, setIsTransferring] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const { isConnected, issueTokens, walletAddress, tokenService } = useWeb3();
  const { toast } = useToast();

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

  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugMessage = `[${timestamp}] ${message}`;
    console.log(debugMessage);
    setDebugInfo(prev => [...prev.slice(-4), debugMessage]); // Keep last 5 messages
  };

  const validateStarknetAddress = (address: string): boolean => {
    // Basic Starknet address validation
    if (!address) return false;
    if (!address.startsWith('0x')) return false;
    if (address.length < 60 || address.length > 70) return false;
    if (!/^0x[0-9a-fA-F]+$/.test(address)) return false;
    return true;
  };

  const validateAmount = (amount: string): boolean => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= 1000000; // Max 1M tokens per transfer
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    addDebugInfo('🚀 Starting token transfer validation...');
    
    // Validation checks
    if (!isConnected) {
      addDebugInfo('❌ Wallet not connected');
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to transfer tokens",
        variant: "destructive"
      });
      return;
    }

    if (!formData.vendor || !formData.amount || !formData.purpose) {
      addDebugInfo('❌ Missing required fields');
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!validateAmount(formData.amount)) {
      addDebugInfo('❌ Invalid amount');
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount between 0.01 and 1,000,000",
        variant: "destructive"
      });
      return;
    }

    const selectedVendor = vendors.find(v => v.id === formData.vendor);
    if (!selectedVendor) {
      addDebugInfo('❌ Invalid vendor selection');
      toast({
        title: "Invalid Vendor",
        description: "Please select a valid vendor",
        variant: "destructive"
      });
      return;
    }

    if (!validateStarknetAddress(selectedVendor.address)) {
      addDebugInfo(`❌ Invalid recipient address: ${selectedVendor.address}`);
      toast({
        title: "Invalid Address",
        description: "Vendor address is not a valid Starknet address",
        variant: "destructive"
      });
      return;
    }

    addDebugInfo(`✅ Validation passed - transferring to: ${selectedVendor.address}`);
    setIsTransferring(true);

    try {
      addDebugInfo(`🔗 Current wallet: ${walletAddress}`);
      addDebugInfo(`🏭 Token service available: ${!!tokenService}`);
      addDebugInfo(`💰 Transferring ${formData.amount} CAT to ${selectedVendor.name}`);

      const result = await issueTokens(selectedVendor.address, formData.amount);
      
      addDebugInfo(`✅ Transfer successful: ${result.transactionHash}`);
      
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
      addDebugInfo(`❌ Transfer failed: ${errorMessage}`);
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

  const handleTestConnection = async () => {
    addDebugInfo('🧪 Testing wallet and contract connection...');
    
    if (!isConnected) {
      addDebugInfo('❌ No wallet connected');
      return;
    }

    if (!tokenService) {
      addDebugInfo('❌ Token service not available');
      return;
    }

    try {
      addDebugInfo('📊 Attempting to fetch balance...');
      await tokenService.getBalance(walletAddress);
      addDebugInfo('✅ Connection test successful');
      
      toast({
        title: "Connection Test",
        description: "Wallet and contract connection working properly",
      });
    } catch (error: any) {
      addDebugInfo(`❌ Connection test failed: ${error.message}`);
      toast({
        title: "Connection Test Failed",
        description: error.message,
        variant: "destructive"
      });
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
          <div className="space-y-2">
            <Label htmlFor="vendor">Select Vendor *</Label>
            <Select value={formData.vendor} onValueChange={(value) => setFormData({...formData, vendor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a vendor..." />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name} (Test Address)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (CAT) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount..."
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              min="0.01"
              max="1000000"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Select value={formData.purpose} onValueChange={(value) => setFormData({...formData, purpose: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose..." />
              </SelectTrigger>
              <SelectContent>
                {transferPurposes.map((purpose) => (
                  <SelectItem key={purpose} value={purpose}>
                    {purpose}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional notes for this transfer..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!isConnected || isTransferring}
            >
              {isTransferring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Transfer...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Transfer Tokens
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={!isConnected}
            >
              Test Connection
            </Button>
          </div>

          {!isConnected && (
            <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-700">
                Please connect your wallet to transfer tokens
              </p>
            </div>
          )}

          {/* Debug Information */}
          {debugInfo.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
              <h4 className="text-sm font-medium mb-2">Debug Information:</h4>
              <div className="space-y-1">
                {debugInfo.map((info, index) => (
                  <p key={index} className="text-xs font-mono text-gray-600">
                    {info}
                  </p>
                ))}
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TokenTransferForm;
