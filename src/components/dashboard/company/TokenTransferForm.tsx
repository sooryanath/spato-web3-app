
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2 } from "lucide-react";

const TokenTransferForm = () => {
  const [formData, setFormData] = useState({
    vendor: '',
    amount: '',
    purpose: '',
    notes: ''
  });
  const [isTransferring, setIsTransferring] = useState(false);
  
  const { isConnected, issueTokens } = useWeb3();
  const { toast } = useToast();

  // Mock vendor data - in real implementation, this would come from API
  const vendors = [
    { id: 'vendor1', name: 'ABC Manufacturing Ltd', address: '0x1234...5678' },
    { id: 'vendor2', name: 'XYZ Logistics Co', address: '0x2345...6789' },
    { id: 'vendor3', name: 'Tech Solutions Inc', address: '0x3456...7890' },
    { id: 'vendor4', name: 'Global Supplies Corp', address: '0x4567...8901' }
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
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to transfer tokens",
        variant: "destructive"
      });
      return;
    }

    if (!formData.vendor || !formData.amount || !formData.purpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedVendor = vendors.find(v => v.id === formData.vendor);
    if (!selectedVendor) {
      toast({
        title: "Invalid Vendor",
        description: "Please select a valid vendor",
        variant: "destructive"
      });
      return;
    }

    setIsTransferring(true);

    try {
      console.log('🚀 Initiating token transfer:', {
        vendor: selectedVendor.name,
        amount: formData.amount,
        purpose: formData.purpose,
        recipient: selectedVendor.address
      });

      const result = await issueTokens(selectedVendor.address, formData.amount);
      
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

      console.log('✅ Token transfer completed:', result);
    } catch (error) {
      console.error('❌ Token transfer failed:', error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer tokens. Please try again.",
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
          <div className="space-y-2">
            <Label htmlFor="vendor">Select Vendor *</Label>
            <Select value={formData.vendor} onValueChange={(value) => setFormData({...formData, vendor: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a vendor..." />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
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
              min="1"
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

          <Button 
            type="submit" 
            className="w-full"
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

          {!isConnected && (
            <p className="text-sm text-amber-600 text-center">
              Please connect your wallet to transfer tokens
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default TokenTransferForm;
