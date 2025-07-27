import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users 
} from 'lucide-react';

export function StatsCards() {
  // Mock data for demonstration - in a real app, this would come from your WooCommerce API
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1% from last month",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Orders",
      value: "2,350",
      change: "+180.1% from last month",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Sales",
      value: "12,234",
      change: "+19% from last month",
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Active Customers",
      value: "573",
      change: "+201 since last hour",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}