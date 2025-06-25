
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Vendor {
  id: string;
  name: string;
  address: string;
}

interface VendorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  vendors: Vendor[];
}

const VendorSelector = ({ value, onChange, vendors }: VendorSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="vendor">Select Vendor *</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
};

export default VendorSelector;
