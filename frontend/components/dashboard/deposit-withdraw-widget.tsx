'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownToLine, ArrowUpFromLine, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function DepositWithdrawWidget() {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useAccount();

  const handleDeposit = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate deposit transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully deposited ${amount} BTC`);
      setAmount('');
    } catch (error) {
      toast.error('Deposit failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate withdraw transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`Successfully withdrew ${amount} BTC`);
      setAmount('');
    } catch (error) {
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownToLine className="w-5 h-5 text-primary" />
          Deposit & Withdraw
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (BTC)</Label>
              <Input
                id="deposit-amount"
                type="number"
                placeholder="0.00000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.00000001"
                min="0"
              />
            </div>
            
            <Button 
              onClick={handleDeposit}
              disabled={isLoading || !isConnected}
              className="w-full btn-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  Deposit
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (BTC)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00000000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.00000001"
                min="0"
              />
            </div>
            
            <Button 
              onClick={handleWithdraw}
              disabled={isLoading || !isConnected}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpFromLine className="w-4 h-4 mr-2" />
                  Withdraw
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">On-chain Balance:</span>
            <span className="font-mono">0.12345678 BTC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Locked Collateral:</span>
            <span className="font-mono">0.05000000 BTC</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}