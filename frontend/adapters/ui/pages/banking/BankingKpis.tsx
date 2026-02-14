/**
 * BankingKpis Component
 * Displays key performance indicators for banking operations
 */

import type { BankingOperation } from '../../../../core/domain/compliance';

interface BankingKpisProps {
  operation: BankingOperation | null;
}

export const BankingKpis = ({ operation }: BankingKpisProps) => {
  if (!operation) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No banking operation yet
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* CB Before */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">CB Before</p>
        <p className="mt-2 text-3xl font-bold text-foreground">
          {operation.cbBefore}
        </p>
      </div>

      {/* Applied */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">Applied</p>
        <p className="mt-2 text-3xl font-bold text-info">
          {operation.applied > 0 ? '+' : ''}{operation.applied}
        </p>
      </div>

      {/* CB After */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">CB After</p>
        <p className={`mt-2 text-3xl font-bold ${operation.cbAfter >= 0 ? 'text-success' : 'text-error'}`}>
          {operation.cbAfter}
        </p>
      </div>
    </div>
  );
};
