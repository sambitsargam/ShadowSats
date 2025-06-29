'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Copy, Network, CheckCircle } from 'lucide-react';
import { useWallet } from '@/lib/hooks/use-wallet';
import { toast } from 'sonner';

export function WalletStatusCard() {
  const { isConnected, address, network, connect } = useWallet();

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const switchNetwork = async () => {
    try {
      // Simulate network switch
      toast.success('Switched to Citrea Testnet');
    } catch (error) {
      toast.error('Failed to switch network');
    }
  };

  if (!isConnected) {
    return (
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Wallet Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No Wallet Connected</h3>
              <p className="text-muted-foreground">
                Connect your wallet to start trading
              </p>
            </div>
            <Button onClick={connect} className="btn-primary">
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Wallet Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <Badge variant="secondary" className="bg-green-500/10 text-green-400">
            Connected
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Address</label>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 text-sm bg-muted px-2 py-1 rounded font-mono">
                {address ? `${address.slice(0, 12)}...${address.slice(-12)}` : ''}
              </code>
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm text-muted-foreground">Network</label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="border-primary/50 text-primary">
                <Network className="w-3 h-3 mr-1" />
                {network || 'Citrea Testnet'}
              </Badge>
              <Button variant="ghost" size="sm" onClick={switchNetwork}>
                Switch
              </Button>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Wallet Provider: <span className="text-foreground">MetaMask</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}