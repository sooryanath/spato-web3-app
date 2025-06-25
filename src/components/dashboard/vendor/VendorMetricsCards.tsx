
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Clock, CheckCircle } from "lucide-react";

const VendorMetricsCards = () => {
  const metrics = [
    {
      title: "Total CAT Received",
      value: "12,450.75",
      unit: "CAT",
      change: "+5.2%",
      icon: Wallet,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Active Contracts",
      value: "23",
      unit: "contracts",
      change: "+2",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Payments",
      value: "3,200.50",
      unit: "CAT",
      change: "Due in 7 days",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Completed Orders",
      value: "156",
      unit: "orders",
      change: "+12 this month",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </span>
                <span className="text-sm text-gray-500">{metric.unit}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {metric.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VendorMetricsCards;
