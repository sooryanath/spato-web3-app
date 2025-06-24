
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MetricsCards = () => {
  const navigate = useNavigate();

  const metrics = [
    {
      title: "Total CAT Issued",
      value: "₹2.4 Cr",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      route: "/bank-dashboard/cat-issued"
    },
    {
      title: "Active Requests",
      value: "47",
      change: "+8.2%",
      icon: FileText,
      color: "text-blue-600",
      route: "/bank-dashboard/active-requests"
    },
    {
      title: "Total Companies",
      value: "156",
      change: "+5.1%",
      icon: Users,
      color: "text-purple-600",
      route: "/bank-dashboard/total-companies"
    },
    {
      title: "Monthly Growth",
      value: "23.8%",
      change: "+2.4%",
      icon: TrendingUp,
      color: "text-orange-600",
      route: null
    }
  ];

  const handleMetricClick = (route: string | null) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isClickable = metric.route !== null;
        
        return (
          <Card 
            key={index} 
            className={`${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
            onClick={() => handleMetricClick(metric.route)}
          >
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
