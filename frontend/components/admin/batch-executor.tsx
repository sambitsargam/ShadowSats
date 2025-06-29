'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, RefreshCw, Play, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Batch {
  id: string;
  size: number;
  count: number;
  status: 'pending' | 'executing' | 'executed' | 'failed';
  gasEstimate?: number;
  createdAt: Date;
}

export function BatchExecutor() {
  const [executingBatches, setExecutingBatches] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: batches, isLoading, refetch } = useQuery({
    queryKey: ['pendingBatches'],
    queryFn: api.getPendingBatches,
  });

  const executeBatchMutation = useMutation({
    mutationFn: api.executeBatch,
    onSuccess: (result, batchId) => {
      toast.success(`Batch ${batchId} executed successfully!`);
      setExecutingBatches(prev => {
        const newSet = new Set(prev);
        newSet.delete(batchId);
        return newSet;
      });
      queryClient.invalidateQueries({ queryKey: ['pendingBatches'] });
    },
    onError: (error, batchId) => {
      toast.error(`Failed to execute batch ${batchId}: ${error.message}`);
      setExecutingBatches(prev => {
        const newSet = new Set(prev);
        newSet.delete(batchId);
        return newSet;
      });
    },
  });

  // Mock data for demonstration
  const mockBatches: Batch[] = [
    {
      id: 'batch_001',
      size: 0.25,
      count: 15,
      status: 'pending',
      gasEstimate: 0.001,
      createdAt: new Date('2024-01-15T10:30:00'),
    },
    {
      id: 'batch_002',
      size: 0.18,
      count: 8,
      status: 'pending',
      gasEstimate: 0.0008,
      createdAt: new Date('2024-01-15T10:25:00'),
    },
    {
      id: 'batch_003',
      size: 0.42,
      count: 23,
      status: 'executed',
      gasEstimate: 0.0015,
      createdAt: new Date('2024-01-15T10:20:00'),
    },
  ];

  const displayBatches = batches || mockBatches;

  const handleExecuteBatch = async (batchId: string) => {
    setExecutingBatches(prev => new Set(prev).add(batchId));
    executeBatchMutation.mutate(batchId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'executing':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'executed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Batch Executor
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Fetch Pending Batches
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Size (BTC)</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Gas Est.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayBatches.map((batch) => {
                const isExecuting = executingBatches.has(batch.id);
                
                return (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono text-sm">
                      {batch.id}
                    </TableCell>
                    <TableCell className="font-mono">
                      {batch.size.toFixed(8)}
                    </TableCell>
                    <TableCell>{batch.count}</TableCell>
                    <TableCell className="font-mono">
                      {batch.gasEstimate?.toFixed(6)} BTC
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(isExecuting ? 'executing' : batch.status)}
                      >
                        {isExecuting ? 'EXECUTING' : batch.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {batch.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleExecuteBatch(batch.id)}
                          disabled={isExecuting || executeBatchMutation.isPending}
                          className="btn-primary"
                        >
                          {isExecuting ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Executing
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Execute
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Batch Execution Info</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total Pending:</span>
              <div className="font-mono">
                {displayBatches.filter(b => b.status === 'pending').length} batches
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Total Volume:</span>
              <div className="font-mono">
                {displayBatches
                  .filter(b => b.status === 'pending')
                  .reduce((sum, b) => sum + b.size, 0)
                  .toFixed(8)} BTC
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Est. Gas Cost:</span>
              <div className="font-mono">
                {displayBatches
                  .filter(b => b.status === 'pending')
                  .reduce((sum, b) => sum + (b.gasEstimate || 0), 0)
                  .toFixed(6)} BTC
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}