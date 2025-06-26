
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useCompanyDashboard } from '@/contexts/CompanyDashboardContext';
import { useGlobalTransactions } from '@/contexts/GlobalTransactionContext';

const RequestCATTokens = () => {
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    justification: '',
    documents: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { addCATRequest } = useCompanyDashboard();
  const { addTransaction } = useGlobalTransactions();

  const purposes = [
    'Working Capital',
    'Raw Materials Purchase',
    'Equipment Financing',
    'Vendor Payments',
    'Operational Expenses',
    'Other'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...fileNames]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.purpose || !formData.justification) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.documents.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one supporting document",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Add to company dashboard context
      addCATRequest({
        amount: formData.amount,
        purpose: formData.purpose,
        documents: formData.documents
      });

      // Add to global transactions context for both dashboards
      addTransaction({
        type: 'token_issue',
        amount: `₹${formData.amount}`,
        from: 'TechCorp Industries',
        to: 'HDFC Bank',
        company: 'TechCorp Industries',
        purpose: `CAT Request - ${formData.purpose}`,
        status: 'Pending',
        txHash: `CAT-REQ-${Date.now()}`,
        tokenType: 'CAT Request',
        recipient: 'HDFC Bank'
      });

      toast({
        title: "Request Submitted",
        description: `CAT token request for ₹${formData.amount} has been submitted successfully`,
      });

      // Reset form
      setFormData({
        amount: '',
        purpose: '',
        justification: '',
        documents: []
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit CAT token request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Request CAT Tokens</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Token Amount *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="purpose">Purpose *</Label>
              <Select value={formData.purpose} onValueChange={(value) => setFormData({...formData, purpose: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposes.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="justification">Business Justification *</Label>
            <Textarea
              id="justification"
              placeholder="Provide detailed business justification for the token request..."
              value={formData.justification}
              onChange={(e) => setFormData({...formData, justification: e.target.value})}
              rows={3}
              required
            />
          </div>

          <div>
            <Label>Supporting Documents *</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> supporting documents
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB each)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    multiple 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              
              {formData.documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Uploaded Documents:</p>
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <span className="text-sm">{doc}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting Request..." : "Submit CAT Token Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RequestCATTokens;
