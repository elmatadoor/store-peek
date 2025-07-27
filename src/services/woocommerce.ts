import { WooCommerceOrder, WooCommerceConfig } from '@/types/woocommerce';

export interface StoreStats {
  totalRevenue: number;
  totalOrders: number;
  totalSales: number;
  activeCustomers: number;
  currency: string;
  revenueChange?: number;
  ordersChange?: number;
  salesChange?: number;
  customersChange?: number;
}

class WooCommerceService {
  private config: WooCommerceConfig | null = null;

  setConfig(config: WooCommerceConfig) {
    this.config = config;
    // Store config in localStorage for persistence
    localStorage.setItem('woocommerce_config', JSON.stringify(config));
  }

  getConfig(): WooCommerceConfig | null {
    if (this.config) return this.config;
    
    const stored = localStorage.getItem('woocommerce_config');
    if (stored) {
      this.config = JSON.parse(stored);
      return this.config;
    }
    
    return null;
  }

  private getAuthHeader(): string {
    const config = this.getConfig();
    if (!config) throw new Error('WooCommerce not configured');
    
    return btoa(`${config.consumerKey}:${config.consumerSecret}`);
  }

  private async makeRequest(endpoint: string): Promise<any> {
    const config = this.getConfig();
    if (!config) throw new Error('WooCommerce not configured');

    const url = `${config.storeUrl}/wp-json/wc/v3${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${this.getAuthHeader()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WooCommerce API Error:', error);
      throw error;
    }
  }

  async getOrders(page = 1, perPage = 20, status?: string): Promise<WooCommerceOrder[]> {
    let endpoint = `/orders?page=${page}&per_page=${perPage}&orderby=date&order=desc`;
    if (status) {
      endpoint += `&status=${status}`;
    }
    
    return await this.makeRequest(endpoint);
  }

  async getOrder(id: number): Promise<WooCommerceOrder> {
    return await this.makeRequest(`/orders/${id}`);
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/orders?per_page=1');
      return true;
    } catch (error) {
      return false;
    }
  }

  async getStats(dateFrom?: string, dateTo?: string): Promise<StoreStats> {
    try {
      let endpoint = '/reports/sales?context=view';
      if (dateFrom && dateTo) {
        endpoint += `&date_min=${dateFrom}&date_max=${dateTo}`;
      }
      
      const salesReport = await this.makeRequest(endpoint);
      
      // Get orders for the period
      let ordersEndpoint = '/orders?per_page=100&orderby=date&order=desc';
      if (dateFrom && dateTo) {
        ordersEndpoint += `&after=${dateFrom}&before=${dateTo}`;
      }
      
      const orders = await this.makeRequest(ordersEndpoint);
      
      // Get customers count
      const customers = await this.makeRequest('/customers?per_page=100');
      
      // Calculate statistics
      const totalRevenue = parseFloat(salesReport.total_sales || '0');
      const totalOrders = salesReport.total_orders || orders.length || 0;
      const totalSales = salesReport.total_items || 0;
      const activeCustomers = customers.length || 0;
      const currency = salesReport.currency || 'USD';
      
      return {
        totalRevenue,
        totalOrders,
        totalSales,
        activeCustomers,
        currency
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return default stats if API fails
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalSales: 0,
        activeCustomers: 0,
        currency: 'USD'
      };
    }
  }

  async getStatsWithComparison(dateFrom: string, dateTo: string): Promise<StoreStats> {
    try {
      // Get current period stats
      const currentStats = await this.getStats(dateFrom, dateTo);
      
      // Calculate previous period dates
      const currentStart = new Date(dateFrom);
      const currentEnd = new Date(dateTo);
      const periodLength = currentEnd.getTime() - currentStart.getTime();
      
      const previousEnd = new Date(currentStart.getTime() - 1);
      const previousStart = new Date(previousEnd.getTime() - periodLength);
      
      const previousStats = await this.getStats(
        previousStart.toISOString().split('T')[0],
        previousEnd.toISOString().split('T')[0]
      );
      
      // Calculate percentage changes
      const revenueChange = previousStats.totalRevenue > 0 
        ? ((currentStats.totalRevenue - previousStats.totalRevenue) / previousStats.totalRevenue) * 100 
        : 0;
      
      const ordersChange = previousStats.totalOrders > 0 
        ? ((currentStats.totalOrders - previousStats.totalOrders) / previousStats.totalOrders) * 100 
        : 0;
      
      const salesChange = previousStats.totalSales > 0 
        ? ((currentStats.totalSales - previousStats.totalSales) / previousStats.totalSales) * 100 
        : 0;
      
      const customersChange = previousStats.activeCustomers > 0 
        ? ((currentStats.activeCustomers - previousStats.activeCustomers) / previousStats.activeCustomers) * 100 
        : 0;
      
      return {
        ...currentStats,
        revenueChange,
        ordersChange,
        salesChange,
        customersChange
      };
    } catch (error) {
      console.error('Error fetching stats with comparison:', error);
      return this.getStats(dateFrom, dateTo);
    }
  }
}

export const wooCommerceService = new WooCommerceService();