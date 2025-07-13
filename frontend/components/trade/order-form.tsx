'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Loader2, Zap } from 'lucide-react';
import { useZkProof } from '@/lib/hooks/use-zk-proof';
import { toast } from 'sonner';

export function OrderForm() {
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const { isConnected } = useAccount();
  const { generateProof, isGenerating } = useZkProof();

  const handleSubmitOrder = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!price || !size) {
      toast.error('Please fill in all fields');
      return;
    }

    const numPrice = parseFloat(price);
    const numSize = parseFloat(size);

    if (numPrice <= 0 || numSize <= 0) {
      toast.error('Price and size must be greater than 0');
      return;
    }

    try {
      toast.loading('Generating zero-knowledge proof...', { id: 'proof-gen' });
      
      const proof = await generateProof({
        price: numPrice,
        size: numSize,
        side,
        nonce: Date.now(),
      });

      toast.dismiss('proof-gen');
      toast.success('Order submitted successfully!');
      
      // Reset form
      setPrice('');
      setSize('');
    } catch (error) {
      toast.dismiss('proof-gen');
      toast.error('Failed to generate proof. Please try again.');
    }
  };

  const estimatedTotal = price && size ? (parseFloat(price) * parseFloat(size)).toFixed(2) : '0.00';

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Place Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="side">Side</Label>
            <Select value={side} onValueChange={(value: 'buy' | 'sell') => setSide(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Buy
                  </div>
                </SelectItem>
                <SelectItem value="sell">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Sell
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              placeholder="67,500.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Size (BTC)</Label>
            <Input
              id="size"
              type="number"
              placeholder="0.001"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              step="0.00000001"
              min="0"
            />
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Total:</span>
            <span className="font-mono">${estimatedTotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fee:</span>
            <span className="font-mono">0.1%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <Shield className="w-4 h-4 text-primary" />
          <div className="text-sm">
            <span className="font-medium text-primary">Zero-Knowledge Order</span>
            <p className="text-muted-foreground text-xs">
              Your order details will be kept private using ZK proofs
            </p>
          </div>
        </div>

        <Button
          onClick={handleSubmitOrder}
          disabled={isGenerating || !isConnected}
          className={`w-full ${side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Proof...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Generate Proof & Submit {side === 'buy' ? 'Buy' : 'Sell'} Order
            </>
          )}
        </Button>

        {!isConnected && (
          <Badge variant="outline" className="w-full justify-center py-2">
            Connect wallet to place orders
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}