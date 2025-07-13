'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useWallet } from '@/lib/hooks/use-wallet';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export function Header() {

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
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}