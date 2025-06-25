
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const VendorNotifications = () => {
  const notifications = [
    {
      id: 1,
      type: "payment",
      title: "Payment Received",
      message: "2,500 CAT from TechCorp Ltd",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
      unread: true
    },
    {
      id: 2,
      type: "reminder",
      title: "Invoice Due Soon",
      message: "Invoice #INV-456 due in 2 days",
      time: "1 day ago",
      icon: Clock,
      color: "text-amber-600",
      unread: true
    },
    {
      id: 3,
      type: "alert",
      title: "Contract Update",
      message: "Review required for Enterprise Co contract",
      time: "2 days ago",
      icon: AlertTriangle,
      color: "text-red-600",
      unread: false
    }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
          <Badge variant="secondary" className="ml-2">
            {notifications.filter(n => n.unread).length}
          </Badge>
        </CardTitle>
        <Button variant="ghost" size="sm">
          Mark All Read
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg ${
                notification.unread ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              <div className={`p-1 rounded-full ${notification.unread ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <notification.icon className={`w-4 h-4 ${notification.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </p>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorNotifications;
