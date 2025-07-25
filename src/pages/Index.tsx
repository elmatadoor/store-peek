import { useState, useEffect } from 'react';
import { WooCommerceOrder } from '@/types/woocommerce';
import { wooCommerceService } from '@/services/woocommerce';
import { WooCommerceSetup } from '@/components/WooCommerceSetup';
import { OrdersList } from '@/components/OrdersList';
import { OrderDetails } from '@/components/OrderDetails';

const Index = () => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WooCommerceOrder | null>(null);

  useEffect(() => {
    // Check if WooCommerce is already configured
    const config = wooCommerceService.getConfig();
    setIsConfigured(!!config);
  }, []);

  const handleConfigured = () => {
    setIsConfigured(true);
  };

  const handleOrderSelect = (order: WooCommerceOrder) => {
    setSelectedOrder(order);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  if (!isConfigured) {
    return <WooCommerceSetup onConfigured={handleConfigured} />;
  }

  if (selectedOrder) {
    return <OrderDetails order={selectedOrder} onBack={handleBackToOrders} />;
  }

  return <OrdersList onOrderSelect={handleOrderSelect} />;
};

export default Index;
