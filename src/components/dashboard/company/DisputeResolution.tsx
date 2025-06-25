
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MessageSquare, Clock, ChevronRight } from "lucide-react";

const DisputeResolution = () => {
  // Mock dispute data
  const disputes = [
    {
      id: 1,
      vendor: "ABC Manufacturing Ltd",
      amount: "25,000",
      issue: "Delivery delay dispute",
      status: "Open",
      priority: "High",
      createdDate: "2024-01-13",
      lastUpdate: "2 hours ago"
    },
    {
      id: 2,
      vendor: "Tech Solutions Inc",
      amount: "35,000",
      issue: "Quality specifications not met",
      status: "In Review",
      priority: "Medium",
      createdDate: "2024-01-12",
      lastUpdate: "1 day ago"
    },
    {
      id: 3,
      vendor: "XYZ Logistics Co",
      amount: "15,000",
      issue: "Missing documentation",
      status: "Resolved",
      priority: "Low",
      createdDate: "2024-01-10",
      lastUpdate: "3 days ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDispute = (disputeId: number) => {
    // In a real implementation, this would navigate to dispute details
    console.log('Viewing dispute:', disputeId);
  };

  const handleCreateDispute = () => {
    // In a real implementation, this would open a dispute creation form
    console.log('Creating new dispute');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Dispute Resolution</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleCreateDispute}>
            New Dispute
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {disputes.map((dispute) => (
          <div 
            key={dispute.id} 
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleViewDispute(dispute.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-gray-900">{dispute.vendor}</p>
                  <Badge className={getPriorityColor(dispute.priority)}>
                    {dispute.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{dispute.issue}</p>
                <p className="text-sm font-medium text-gray-900">
                  Amount: {dispute.amount} CAT
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(dispute.status)}>
                  {dispute.status}
                </Badge>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Created: {dispute.createdDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>Updated: {dispute.lastUpdate}</span>
              </div>
            </div>
          </div>
        ))}
        
        {disputes.length === 0 && (
          <div className="text-center py-6">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No disputes to display</p>
            <p className="text-sm text-gray-400">All transactions are proceeding smoothly</p>
          </div>
        )}
        
        <div className="pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-600">1</p>
              <p className="text-xs text-gray-500">Open</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">1</p>
              <p className="text-xs text-gray-500">In Review</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">1</p>
              <p className="text-xs text-gray-500">Resolved</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisputeResolution;
