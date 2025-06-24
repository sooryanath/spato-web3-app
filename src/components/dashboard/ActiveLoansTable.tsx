
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const ActiveLoansTable = () => {
  const activeLoans = [
    {
      loanId: "L1001",
      vendorName: "Tech Solutions Ltd",
      amount: "₹75,000",
      dueDate: "2024-06-15",
      total: "₹82,500",
      remaining: "₹82,500"
    },
    {
      loanId: "L1002",
      vendorName: "Manufacturing Experts",
      amount: "₹50,000",
      dueDate: "2024-06-20",
      total: "₹55,000",
      remaining: "₹30,000"
    },
    {
      loanId: "L1003",
      vendorName: "Supply Chain Partners",
      amount: "₹1,25,000",
      dueDate: "2024-07-05",
      total: "₹1,37,500",
      remaining: "₹1,37,500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Loans</CardTitle>
        <p className="text-sm text-gray-600">Current outstanding loans issued to vendors</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Total / Remaining</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeLoans.map((loan) => (
              <TableRow key={loan.loanId}>
                <TableCell className="font-medium">{loan.loanId}</TableCell>
                <TableCell>{loan.vendorName}</TableCell>
                <TableCell>{loan.amount}</TableCell>
                <TableCell>{loan.dueDate}</TableCell>
                <TableCell>{loan.total} / {loan.remaining}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline">
                    Dispute
                  </Button>
                </TableCell>
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

export default ActiveLoansTable;
