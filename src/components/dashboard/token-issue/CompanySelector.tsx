
import { CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Company {
  id: string;
  name: string;
}

interface CompanySelectorProps {
  company: string;
  onCompanyChange: (value: string) => void;
  companies: Company[];
}

const CompanySelector = ({ company, onCompanyChange, companies }: CompanySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="company">Company *</Label>
      <Select value={company} onValueChange={onCompanyChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select company" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((comp) => (
            <SelectItem key={comp.id} value={comp.id}>
              <div className="font-medium">{comp.name}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {company && (
        <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-xs text-green-700">
            Tokens will be minted for this company via the registered anchor
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
