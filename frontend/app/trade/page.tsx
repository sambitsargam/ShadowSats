'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { OrderForm } from '@/components/trade/order-form';
import { OrderBook } from '@/components/trade/order-book';

export default function Trade() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Trade</h1>
          <p className="text-muted-foreground mt-2">
            Place confidential orders with zero-knowledge proofs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <OrderForm />
          <OrderBook />
        </div>
      </div>
    </DashboardLayout>
  );
}