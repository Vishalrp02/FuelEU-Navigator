/**
 * DashboardNav Component
 * Global navigation bar for the Fuel EU Compliance Dashboard
 */

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const DashboardNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/routes', label: 'Routes', icon: '🛣️' },
    { path: '/compare', label: 'Compare', icon: '📊' },
    { path: '/banking', label: 'Banking', icon: '🏦' },
    { path: '/pooling', label: 'Pooling', icon: '🤝' },
  ];

  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">⛽</div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Fuel EU Compliance</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
