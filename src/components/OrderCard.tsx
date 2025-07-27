import { WooCommerceOrder } from '@/types/woocommerce';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Calendar, DollarSign, User } from 'lucide-react';
import { format } from 'date-fns';

interface OrderCardProps {
  order: WooCommerceOrder;
  onClick: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getStatusLabel = (status: string) => {
    return status.replace('-', ' ').toUpperCase();
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              #{order.number}
            </Badge>
            <StatusBadge status={order.status as any}>
              {getStatusLabel(order.status)}
            </StatusBadge>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              {order.billing.first_name} {order.billing.last_name}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(order.date_created)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-lg">
                {order.total} DA
              </span>
            </div>
            <Badge variant="secondary">
              {order.line_items.length} item{order.line_items.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}