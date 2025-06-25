
import { Loader2, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IssueTokenButtonProps {
  isConnected: boolean;
  isIssuing: boolean;
}

const IssueTokenButton = ({ isConnected, isIssuing }: IssueTokenButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full" 
      disabled={!isConnected || isIssuing}
    >
      {isIssuing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Minting Tokens...
        </>
      ) : (
        <>
          <Coins className="mr-2 h-4 w-4" />
          Issue Tokens
        </>
      )}
    </Button>
  );
};

export default IssueTokenButton;
