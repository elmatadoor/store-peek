import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  TrendingDown
} from 'lucide-react';
import { StoreStats } from '@/services/woocommerce';

interface StatsCardsProps {
  stats: StoreStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: stats.currency,
    }).format(amount);
  };

  const formatChange = (change: number | undefined) => {
    if (change === undefined) return '';
    const isPositive = change >= 0;
    return `${isPositive ? '+' : ''}${change.toFixed(1)}% from last period`;
  };

  const getChangeIcon = (change: number | undefined) => {
    if (change === undefined) return null;
    return change >= 0 ? TrendingUp : TrendingDown;
  };

  const getChangeColor = (change: number | undefined) => {
    if (change === undefined) return 'text-muted-foreground';
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const statsData = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChange,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Orders",
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Total Items Sold",
      value: stats.totalSales.toLocaleString(),
      change: stats.salesChange,
      icon: TrendingUp,
      color: "text-orange-600"
    },
    {
      title: "Customers",
      value: stats.activeCustomers.toLocaleString(),
      change: stats.customersChange,
      icon: Users,
      color: "text-purple-600"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded w-24 mb-1"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const ChangeIcon = getChangeIcon(stat.change);
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change !== undefined && (
                <p className={`text-xs flex items-center gap-1 ${getChangeColor(stat.change)}`}>
                  {ChangeIcon && <ChangeIcon className="h-3 w-3" />}
                  {formatChange(stat.change)}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}