
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PurposeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  purposes: string[];
}

const PurposeSelector = ({ value, onChange, purposes }: PurposeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="purpose">Purpose *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select purpose..." />
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
  );
};

export default PurposeSelector;
