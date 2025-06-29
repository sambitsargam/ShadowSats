'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

const stats = [
  {
    title: 'Total Balance',
    value: '0.12345678 BTC',
    change: '+2.5%',
    icon: DollarSign,
    positive: true,
  },
  {
    title: 'Active Orders',
    value: '3',
    change: '+1',
    icon: Activity,
    positive: true,
  },
  {
    title: '24h Volume',
    value: '1.25678900 BTC',
    change: '+12.3%',
    icon: TrendingUp,
    positive: true,
  },
  {
    title: 'P&L (24h)',
    value: '+0.00123456 BTC',
    change: '+5.7%',
    icon: TrendingUp,
    positive: true,
  },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.positive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <p className={`text-xs ${
                  stat.positive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.change} from yesterday
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}