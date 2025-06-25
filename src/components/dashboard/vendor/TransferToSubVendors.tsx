
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Send, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useToast } from "@/hooks/use-toast";

const TransferToSubVendors = () => {
  const [selectedVendor, setSelectedVendor] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { balance, isConnected, transferTokens } = useWeb3();
  const { toast } = useToast();

  // Mock sub-vendors data
  const subVendors = [
    { id: "sv1", name: "Supply Chain Partners", address: "0x1234...5678" },
    { id: "sv2", name: "Logistics Solutions", address: "0x2345...6789" },
    { id: "sv3", name: "Manufacturing Co.", address: "0x3456...7890" },
    { id: "sv4", name: "Tech Services Ltd", address: "0x4567...8901" }
  ];

  const handleTransfer = async () => {
    if (!selectedVendor || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Missing Information",
        description: "Please select a vendor and enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const vendor = subVendors.find(v => v.id === selectedVendor);
    if (!vendor) return;

    setIsProcessing(true);
    
    try {
      await transferTokens(vendor.address, amount);
      
      toast({
        title: "Transfer Successful",
        description: `${amount} CAT tokens transferred to ${vendor.name}`,
      });
      
      setAmount("");
      setSelectedVendor("");
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Unable to process transfer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const availableBalance = parseFloat(balance.replace(/,/g, '')) || 0;
  const requestedAmount = parseFloat(amount) || 0;
  const isValidAmount = requestedAmount > 0 && requestedAmount <= availableBalance;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>Transfer to Sub-Vendors</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Available Balance:</span>
            <Badge variant="outline" className="text-green-700">
              {balance} CAT
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="vendor-select" className="text-sm font-medium text-gray-700">
              Select Sub-Vendor
            </label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a sub-vendor" />
              </SelectTrigger>
              <SelectContent>
                {subVendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{vendor.name}</span>
                      <span className="text-xs text-gray-500">{vendor.address}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="transfer-amount" className="text-sm font-medium text-gray-700">
              Amount to Transfer
            </label>
            <Input
              id="transfer-amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isConnected || isProcessing}
            />
          </div>
          
          {amount && (
            <div className="flex items-center space-x-2 text-sm">
              {isValidAmount ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Valid amount</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">
                    {requestedAmount > availableBalance ? "Insufficient balance" : "Invalid amount"}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        
        <Button
          onClick={handleTransfer}
          disabled={!isConnected || !selectedVendor || !isValidAmount || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4 mr-2" />
          {isProcessing ? "Processing..." : "Transfer Tokens"}
        </Button>
        
        {!isConnected && (
          <div className="text-center">
            <p className="text-sm text-amber-600">
              Connect your wallet to transfer tokens
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransferToSubVendors;
