/**
 * StatusBadge Component
 * Displays compliance status with visual indicators
 */

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  compliant: boolean;
  className?: string;
}

export const StatusBadge = ({ compliant, className }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
        compliant
          ? 'bg-success/10 text-success'
          : 'bg-error/10 text-error',
        className
      )}
    >
      <span>{compliant ? '✅' : '❌'}</span>
      <span>{compliant ? 'Compliant' : 'Non-compliant'}</span>
    </span>
  );
};
