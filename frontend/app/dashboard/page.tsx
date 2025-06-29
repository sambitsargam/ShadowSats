'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { DepositWithdrawWidget } from '@/components/dashboard/deposit-withdraw-widget';
import { WalletStatusCard } from '@/components/dashboard/wallet-status-card';
import { StatsOverview } from '@/components/dashboard/stats-overview';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your ShadowSats account and view your trading activity.
          </p>
        </div>
        
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepositWithdrawWidget />
          <WalletStatusCard />
        </div>
      </div>
    </DashboardLayout>
  );
}