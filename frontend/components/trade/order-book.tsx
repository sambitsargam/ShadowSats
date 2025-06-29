'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '@/lib/api';

export function OrderBook() {
  const { data: orderBook, isLoading } = useQuery({
    queryKey: ['orderBook'],
    queryFn: api.getOrderBook,
    refetchInterval: 5000,
  });

  const mockOrderBook = {
    bids: [
      { priceRange: '67,400 - 67,500', volume: 2.5, orders: 12 },
      { priceRange: '67,300 - 67,400', volume: 1.8, orders: 8 },
      { priceRange: '67,200 - 67,300', volume: 3.2, orders: 15 },
      { priceRange: '67,100 - 67,200', volume: 0.9, orders: 5 },
    ],
    asks: [
      { priceRange: '67,500 - 67,600', volume: 1.7, orders: 9 },
      { priceRange: '67,600 - 67,700', volume: 2.1, orders: 11 },
      { priceRange: '67,700 - 67,800', volume: 1.4, orders: 6 },
      { priceRange: '67,800 - 67,900', volume: 2.8, orders: 13 },
    ],
  };

  const displayData = orderBook || mockOrderBook;

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Order Book
          <Badge variant="secondary" className="ml-auto">
            ZK Obfuscated
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Order details are obfuscated for privacy. Only volume tiers and price ranges are visible.
        </div>

        {/* Asks (Sell Orders) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span>Sell Orders</span>
          </div>
          <div className="space-y-1">
            {displayData.asks.slice().reverse().map((ask, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 text-sm p-2 bg-red-500/5 border border-red-500/10 rounded">
                <div className="font-mono text-red-400">{ask.priceRange}</div>
                <div className="font-mono text-center">*.*** BTC</div>
                <div className="text-muted-foreground text-right">{ask.orders} orders</div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Price */}
        <div className="flex items-center justify-center py-3 border-y border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">$67,432.50</div>
            <div className="text-sm text-green-500">+1.2% (24h)</div>
          </div>
        </div>

        {/* Bids (Buy Orders) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>Buy Orders</span>
          </div>
          <div className="space-y-1">
            {displayData.bids.map((bid, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 text-sm p-2 bg-green-500/5 border border-green-500/10 rounded">
                <div className="font-mono text-green-400">{bid.priceRange}</div>
                <div className="font-mono text-center">*.*** BTC</div>
                <div className="text-muted-foreground text-right">{bid.orders} orders</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Buy Volume:</span>
            <span className="font-mono">**.*** BTC</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Sell Volume:</span>
            <span className="font-mono">**.*** BTC</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}