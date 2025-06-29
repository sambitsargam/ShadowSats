'use client';

import { Button } from '@/components/ui/button';
import { ArrowDown, Shield, Zap, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  const scrollToDashboard = () => {
    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Zero-Knowledge Trading
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Confidential Bitcoin Trading,{' '}
                <span className="gradient-text">Atomic Settlement</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                Trade Bitcoin with complete privacy using zero-knowledge proofs. 
                Your positions, balances, and strategies remain completely confidential.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToDashboard}
                size="lg" 
                className="btn-primary text-lg px-8"
              >
                Get Started
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
              
              <Link href="/trade">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Start Trading
                </Button>
              </Link>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Private</h3>
                  <p className="text-sm text-muted-foreground">ZK Proofs</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Fast</h3>
                  <p className="text-sm text-muted-foreground">Instant Settlement</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Secure</h3>
                  <p className="text-sm text-muted-foreground">Non-custodial</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Mockup */}
          <div className="relative">
            <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 animate-float">
              <div className="space-y-6">
                {/* Mock trading interface */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Trade BTC/USD</h3>
                  <div className="text-2xl font-bold text-green-500">$67,432</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <div className="text-sm text-green-400 mb-1">Buy Orders</div>
                    <div className="text-lg font-mono">****.**</div>
                    <div className="text-xs text-muted-foreground">Volume: *.*** BTC</div>
                  </div>
                  
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <div className="text-sm text-red-400 mb-1">Sell Orders</div>
                    <div className="text-lg font-mono">****.**</div>
                    <div className="text-xs text-muted-foreground">Volume: *.*** BTC</div>
                  </div>
                </div>
                
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">ZK Proof Generated</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Proof: 0x7a2f...8b9c
                  </div>
                </div>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-400/20 rounded-2xl blur-3xl -z-10" />
          </div>
        </div>
      </div>
      
      {/* Get Started section */}
      <div id="get-started" className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold">Ready to start trading?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect your wallet to access the ShadowSats trading platform. 
            Experience the future of confidential Bitcoin trading.
          </p>
          
          <Link href="/dashboard">
            <Button size="lg" className="btn-primary text-lg px-8">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}