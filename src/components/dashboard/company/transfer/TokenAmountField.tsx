
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TokenAmountFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const TokenAmountField = ({ value, onChange }: TokenAmountFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Amount (CAT) *</Label>
      <Input
        id="amount"
        type="number"
        placeholder="Enter amount..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0.01"
        max="1000000"
        step="0.01"
      />
    </div>
  );
};

export default TokenAmountField;
