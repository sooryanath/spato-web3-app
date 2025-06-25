
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface TransferButtonProps {
  isConnected: boolean;
  isTransferring: boolean;
  onSubmit: () => void;
}

const TransferButton = ({ isConnected, isTransferring, onSubmit }: TransferButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full"
      disabled={!isConnected || isTransferring}
      onClick={onSubmit}
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
  );
};

export default TransferButton;
