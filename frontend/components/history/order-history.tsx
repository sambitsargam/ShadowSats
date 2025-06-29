'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { format } from 'date-fns';

interface Order {
  id: string;
  date: Date;
  side: 'buy' | 'sell';
  price: number;
  size: number;
  status: 'filled' | 'partial' | 'cancelled' | 'pending';
  filled: number;
}

export function OrderHistory() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orderHistory', page, search],
    queryFn: () => api.getOrderHistory({ page, pageSize, search }),
  });

  // Mock data for demonstration
  const mockOrders: Order[] = [
    {
      id: '1',
      date: new Date('2024-01-15T10:30:00'),
      side: 'buy',
      price: 67500,
      size: 0.001,
      status: 'filled',
      filled: 0.001,
    },
    {
      id: '2',
      date: new Date('2024-01-15T09:15:00'),
      side: 'sell',
      price: 67600,
      size: 0.005,
      status: 'partial',
      filled: 0.003,
    },
    {
      id: '3',
      date: new Date('2024-01-14T16:45:00'),
      side: 'buy',
      price: 67400,
      size: 0.002,
      status: 'cancelled',
      filled: 0,
    },
    {
      id: '4',
      date: new Date('2024-01-14T14:20:00'),
      side: 'sell',
      price: 67700,
      size: 0.003,
      status: 'filled',
      filled: 0.003,
    },
    {
      id: '5',
      date: new Date('2024-01-14T11:10:00'),
      side: 'buy',
      price: 67300,
      size: 0.004,
      status: 'pending',
      filled: 0,
    },
  ];

  const displayOrders = orders || mockOrders;
  const filteredOrders = displayOrders.filter(order =>
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.side.toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'filled':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'partial':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pending':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Order History
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Filled</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {format(order.date, 'MMM dd, HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.side === 'buy'
                          ? 'border-green-500/50 text-green-400'
                          : 'border-red-500/50 text-red-400'
                      }
                    >
                      {order.side.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    ${order.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono">
                    {order.size.toFixed(8)} BTC
                  </TableCell>
                  <TableCell className="font-mono">
                    {order.filled.toFixed(8)} BTC
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(order.status)}
                    >
                      {order.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredOrders.length} orders
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">Page {page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={filteredOrders.length < pageSize}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}