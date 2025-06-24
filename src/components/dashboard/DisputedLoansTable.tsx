
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const DisputedLoansTable = () => {
  const disputedLoans = [
    {
      loanId: "L0987",
      vendor: "Hardware Suppliers",
      syndicateCompany: "TechCorp Industries",
      amount: "₹45,000",
      status: "Under Review",
      dateDisputed: "2024-05-10"
    },
    {
      loanId: "L0876",
      vendor: "Software Solutions",
      syndicateCompany: "Global Manufacturing",
      amount: "₹1,20,000",
      status: "Evidence Required",
      dateDisputed: "2024-05-05"
    },
    {
      loanId: "L0765",
      vendor: "Logistics Partner",
      syndicateCompany: "Supply Chain Ltd",
      amount: "₹35,000",
      status: "Mediation",
      dateDisputed: "2024-04-28"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review": return "text-orange-600 bg-orange-50";
      case "Evidence Required": return "text-red-600 bg-red-50";
      case "Mediation": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-orange-500" />
          <span>Disputed Loans</span>
        </CardTitle>
        <p className="text-sm text-gray-600">Loans currently under dispute resolution</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Syndicate Company</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Disputed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disputedLoans.map((loan) => (
              <TableRow key={loan.loanId}>
                <TableCell className="font-medium">{loan.loanId}</TableCell>
                <TableCell>{loan.vendor}</TableCell>
                <TableCell>{loan.syndicateCompany}</TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(loan.status)}`}>
                    {loan.status}
                  </span>
                </TableCell>
                <TableCell>{loan.dateDisputed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <Button variant="ghost" size="sm" className="text-blue-600">
            View Explorer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisputedLoansTable;
