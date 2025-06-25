
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TokenAmountInputProps {
  amount: string;
  onAmountChange: (value: string) => void;
}

const TokenAmountInput = ({ amount, onAmountChange }: TokenAmountInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="amount">Token Amount *</Label>
      <Input
        id="amount"
        type="number"
        placeholder="Enter amount (e.g., 1000)"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        min="0"
        step="1"
      />
      {amount && (
        <p className="text-xs text-gray-600">
          Issuing {amount} CAT tokens
        </p>
      )}
    </div>
  );
};

export default TokenAmountInput;
