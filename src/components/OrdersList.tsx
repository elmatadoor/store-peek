import { useState, useEffect } from 'react';
import { WooCommerceOrder } from '@/types/woocommerce';
import { wooCommerceService } from '@/services/woocommerce';
import { OrderCard } from '@/components/OrderCard';
import { StatsCards } from '@/components/StatsCards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, Search, Filter, Package } from 'lucide-react';

interface OrdersListProps {
  onOrderSelect: (order: WooCommerceOrder) => void;
}

export function OrdersList({ onOrderSelect }: OrdersListProps) {
  const [orders, setOrders] = useState<WooCommerceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  
  const ordersPerPage = 10;

  const loadOrders = async (refresh = false, page = currentPage) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const fetchedOrders = await wooCommerceService.getOrders(
        page, 
        ordersPerPage, 
        statusFilter === 'all' ? undefined : statusFilter
      );
      setOrders(fetchedOrders);
      
      // For demonstration, we'll calculate total from the response
      // In a real WooCommerce API, you'd get this from response headers
      // For now, we'll estimate based on the returned data
      if (fetchedOrders.length < ordersPerPage) {
        setTotalOrders((page - 1) * ordersPerPage + fetchedOrders.length);
      } else {
        // Estimate more pages exist
        setTotalOrders(page * ordersPerPage + 1);
      }
    } catch (error) {
      toast({
        title: "Error Loading Orders",
        description: "Failed to fetch orders from your store.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadOrders(false, 1);
  }, [statusFilter]);

  useEffect(() => {
    loadOrders(false, currentPage);
  }, [currentPage]);

const filteredOrders = orders.filter((order) => {
  const searchLower = searchTerm.trim().toLowerCase();

  // Handle search by order number with "#" prefix (e.g. #1234)
  if (searchLower.startsWith('#')) {
    const cleanOrderNumber = searchLower.slice(1);
    return order.number === cleanOrderNumber;
  }

  // Otherwise, treat as phone number search
  const phone = order.billing.phone?.replace(/\s+/g, '') || '';
  const phoneSearch = searchLower.replace(/\s+/g, '');
  return phone.includes(phoneSearch);
});


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">
              {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button 
            onClick={() => loadOrders(true)} 
            disabled={isRefreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Statistics Cards */}
        <StatsCards />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search orders, customers, or phone numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 mb-8">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Your orders will appear here once customers start placing them.'
                }
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => onOrderSelect(order)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, Math.ceil(totalOrders / ordersPerPage)) }, (_, i) => {
                  const pageNumber = Math.max(1, currentPage - 2) + i;
                  const maxPage = Math.ceil(totalOrders / ordersPerPage);
                  
                  if (pageNumber > maxPage) return null;
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNumber);
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      const maxPage = Math.ceil(totalOrders / ordersPerPage);
                      if (currentPage < maxPage) {
                        setCurrentPage(currentPage + 1);
                      }
                    }}
                    className={currentPage >= Math.ceil(totalOrders / ordersPerPage) ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
