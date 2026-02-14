/**
 * ComplianceIndicator Component
 * Visual indicator for compliance balance status (positive/negative)
 */

import { cn } from '@/lib/utils';

interface ComplianceIndicatorProps {
  value: number;
  label?: string;
  showSign?: boolean;
  className?: string;
}

export const ComplianceIndicator = ({
  value,
  label = 'Compliance Balance',
  showSign = true,
  className,
}: ComplianceIndicatorProps) => {
  const isPositive = value >= 0;
  const displayValue = showSign && !isPositive ? `${value}` : `${isPositive ? '+' : ''}${value}`;

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
      <div
        className={cn(
          'rounded-lg px-4 py-3 text-center font-semibold transition-colors',
          isPositive
            ? 'bg-success/10 text-success'
            : 'bg-error/10 text-error'
        )}
      >
        <p className="text-2xl">{displayValue}</p>
        <p className="text-xs text-muted-foreground">
          {isPositive ? 'Surplus' : 'Deficit'}
        </p>
      </div>
    </div>
  );
};
