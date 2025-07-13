'use client';

import { useAccount } from 'wagmi'
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { BatchExecutor } from '@/components/admin/batch-executor';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export default function Admin() {
  const { address } = useAccount();
  const isAdmin = address?.toLowerCase() === process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.toLowerCase();

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin</h1>
            <p className="text-muted-foreground mt-2">
              Administrative tools for batch execution and system management.
            </p>
          </div>
          
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              Access denied. This page is restricted to administrators only.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin</h1>
          <p className="text-muted-foreground mt-2">
            Administrative tools for batch execution and system management.
          </p>
        </div>
        
        <BatchExecutor />
      </div>
    </DashboardLayout>
  );
}