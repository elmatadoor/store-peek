import { WooCommerceOrder } from '@/types/woocommerce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  MapPin, 
  Mail, 
  Phone,
  Package,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

interface OrderDetailsProps {
  order: WooCommerceOrder;
  onBack: () => void;
}

export function OrderDetails({ order, onBack }: OrderDetailsProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy \'at\' HH:mm');
  };

  const getStatusLabel = (status: string) => {
    return status.replace('-', ' ').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={onBack} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.number}</h1>
            <p className="text-muted-foreground">
              {order.billing.first_name} {order.billing.last_name}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Order Summary
                  <StatusBadge status={order.status as any}>
                    {getStatusLabel(order.status)}
                  </StatusBadge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Created</div>
                      <div className="text-muted-foreground">{formatDate(order.date_created)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Payment</div>
                      <div className="text-muted-foreground">{order.payment_method_title}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Items ({order.line_items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.line_items.map((item, index) => (
                    <div key={item.id}>
                       <div className="flex flex-col">
                         <div className="flex-1">
                           <h4 className="font-medium">{item.name}</h4>
                           {item.sku && (
                             <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                           )}
                           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm">
                             <Badge variant="outline">Qty : {item.quantity}</Badge>
                             <span className="text-muted-foreground">
                               {item.price} DA each
                             </span>
                           </div>
                           <div className="mt-2">
                             <span className="text-sm text-muted-foreground">Price : </span>
                             <span className="font-medium text-primary">
                               {item.total} DA
                             </span>
                           </div>
                         </div>
                       </div>
                      {index < order.line_items.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Note */}
            {order.customer_note && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Customer Note
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{order.customer_note}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Totals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Order Total
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal :</span>
                  <span>{Math.floor(parseFloat(order.total) - parseFloat(order.total_tax) - parseFloat(order.shipping_total))} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping :</span>
                  <span>{order.shipping_total} DA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax :</span>
                  <span>{order.total_tax} DA</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total :</span>
                  <span>{order.total} DA</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                   <h4 className="font-medium mb-2">Contact</h4>
                   <div className="space-y-2 text-sm">
                     {order.billing.phone && (
                       <div className="flex items-center gap-2">
                         <Phone className="w-4 h-4 text-muted-foreground" />
                         <span>{order.billing.phone}</span>
                       </div>
                     )}
                   </div>
                 </div>

                {(order.shipping.address_1 || order.shipping.first_name) && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <div className="text-sm text-muted-foreground">
                        <div>{order.shipping.first_name} {order.shipping.last_name}</div>
                        {order.shipping.company && <div>{order.shipping.company}</div>}
                        <div>{order.shipping.address_1}</div>
                        {order.shipping.address_2 && <div>{order.shipping.address_2}</div>}
                        <div>{order.shipping.city}, {order.shipping.state} {order.shipping.postcode}</div>
                        <div>{order.shipping.country}</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
