
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, FileText } from "lucide-react";

const MetricsCards = () => {
  const metrics = [
    {
      title: "Total CAT Issued",
      value: "₹2.4 Cr",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Requests",
      value: "47",
      change: "+8.2%",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Total Companies",
      value: "156",
      change: "+5.1%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Monthly Growth",
      value: "23.8%",
      change: "+2.4%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-green-600 mt-1">
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsCards;
