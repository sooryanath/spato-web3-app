
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const CATRequestsTable = () => {
  const requests = [
    {
      id: "CAT-001",
      company: "TechCorp Ltd",
      amount: "₹50,00,000",
      purpose: "Working Capital",
      status: "Pending",
      date: "2024-01-15"
    },
    {
      id: "CAT-002", 
      company: "Manufacturing Inc",
      amount: "₹25,00,000",
      purpose: "Equipment Purchase",
      status: "Approved",
      date: "2024-01-14"
    },
    {
      id: "CAT-003",
      company: "Retail Solutions",
      amount: "₹75,00,000", 
      purpose: "Inventory Finance",
      status: "Under Review",
      date: "2024-01-13"
    },
    {
      id: "CAT-004",
      company: "Export House",
      amount: "₹1,00,00,000",
      purpose: "Trade Finance",
      status: "Pending",
      date: "2024-01-12"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "text-green-600 bg-green-50";
      case "Pending": return "text-yellow-600 bg-yellow-50";
      case "Under Review": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CAT Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.company}</TableCell>
                <TableCell>{request.amount}</TableCell>
                <TableCell>{request.purpose}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>{request.date}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    {request.status === "Pending" && (
                      <Button size="sm">Approve</Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CATRequestsTable;
