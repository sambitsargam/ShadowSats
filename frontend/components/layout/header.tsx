'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/lib/hooks/use-wallet';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { isConnected, address, connect, disconnect } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">ShadowSats</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/trade" className="text-foreground/70 hover:text-foreground transition-colors">
              Trade
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {formatAddress(address!)}
                </span>
                <Button variant="outline" onClick={disconnect} size="sm">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connect} className="btn-primary">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}