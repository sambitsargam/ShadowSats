import { OrderProof } from '@/lib/hooks/use-zk-proof';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface OrderSubmission {
  commitment: string;
  proof: string;
  publicInputs: string[];
}

export interface OrderBookEntry {
  priceRange: string;
  volume: number;
  orders: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

export interface OrderHistoryParams {
  page: number;
  pageSize: number;
  search?: string;
}

export const api = {
  async submitOrder(order: OrderSubmission): Promise<{ success: boolean; orderId: string }> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error('Failed to submit order');
    }

    return response.json();
  },

  async getOrderBook(): Promise<OrderBook> {
    const response = await fetch(`${API_BASE_URL}/orders/book`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch order book');
    }

    return response.json();
  },

  async getOrderHistory(params: OrderHistoryParams): Promise<any[]> {
    const searchParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.search && { search: params.search }),
    });

    const response = await fetch(`${API_BASE_URL}/orders/history?${searchParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch order history');
    }

    return response.json();
  },

  async getPendingBatches(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/batches`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch pending batches');
    }

    return response.json();
  },

  async executeBatch(batchId: string): Promise<{ success: boolean; txHash: string }> {
    const response = await fetch(`${API_BASE_URL}/batches/${batchId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to execute batch');
    }

    return response.json();
  },
};