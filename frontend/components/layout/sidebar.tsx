'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  ArrowLeftRight, 
  LayoutDashboard, 
  History, 
  Settings, 
  X 
} from 'lucide-react';
import { toast } from 'sonner';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { address } = useAccount();
  
  // Check if user is admin (you can replace this with your admin address check)
  const isAdmin = address === process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Trade',
      href: '/trade',
      icon: Zap,
    },
    {
      name: 'Swap',
      href: '#',
      icon: ArrowLeftRight,
      comingSoon: true,
    },
    {
      name: 'History',
      href: '/history',
      icon: History,
    },
  ];

  if (isAdmin) {
    navigationItems.push({
      name: 'Admin',
      href: '/admin',
      icon: Settings,
    });
  }

  const handleNavClick = (item: any) => {
    if (item.comingSoon) {
      toast.info('Swap feature coming soon! 🚀', {
        description: 'We\'re working hard to bring you seamless token swapping.',
      });
      return;
    }
    if (onClose) onClose();
  };

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">ShadowSats</span>
          </Link>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            if (item.comingSoon) {
              return (
                <div
                  key={item.name}
                  className="sidebar-item cursor-pointer relative"
                  onClick={() => handleNavClick(item)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    Soon
                  </span>
                </div>
              );
            }
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`sidebar-item ${isActive ? 'bg-primary/10 text-primary' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <ConnectButton />
      </div>
    </div>
  );
}