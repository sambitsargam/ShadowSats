'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { OrderHistory } from '@/components/history/order-history';

export default function History() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">History</h1>
          <p className="text-muted-foreground mt-2">
            View your past orders and trading activity.
          </p>
        </div>
        
        <OrderHistory />
      </div>
    </DashboardLayout>
  );
}