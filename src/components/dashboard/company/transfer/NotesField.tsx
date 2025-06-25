
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const NotesField = ({ value, onChange }: NotesFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Additional Notes</Label>
      <Textarea
        id="notes"
        placeholder="Optional notes for this transfer..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    </div>
  );
};

export default NotesField;
