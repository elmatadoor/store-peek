import { WooCommerceOrder, WooCommerceConfig } from '@/types/woocommerce';

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
}

export const wooCommerceService = new WooCommerceService();