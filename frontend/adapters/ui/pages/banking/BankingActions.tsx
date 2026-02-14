/**
 * BankingActions Component
 * Provides banking operation controls
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface BankingActionsProps {
  canBank: boolean;
  canApply: boolean;
  onBank: (amount: number) => Promise<void>;
  onApply: (amount: number) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const BankingActions = ({
  canBank,
  canApply,
  onBank,
  onApply,
  loading = false,
  error,
}: BankingActionsProps) => {
  const [bankAmount, setBankAmount] = useState<number>(50);
  const [applyAmount, setApplyAmount] = useState<number>(30);
  const [bankLoading, setBankLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(error || null);

  const handleBank = async () => {
    try {
      setActionError(null);
      setBankLoading(true);
      await onBank(bankAmount);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to bank compliance');
    } finally {
      setBankLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setActionError(null);
      setApplyLoading(true);
      await onApply(applyAmount);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to apply banked credit');
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {actionError && (
        <div className="rounded-lg border border-error/30 bg-error/10 p-3 text-error text-sm">
          {actionError}
        </div>
      )}

      {!canBank && !canApply && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-warning text-sm">
          Cannot perform banking operations with non-positive compliance balance
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Bank Compliance */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="font-semibold text-foreground mb-4">Bank Compliance Surplus</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amount to Bank (tonnes)
              </label>
              <input
                type="number"
                value={bankAmount}
                onChange={e => setBankAmount(Number(e.target.value))}
                disabled={!canBank || loading || bankLoading}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground disabled:opacity-50"
                min="0"
              />
            </div>
            <Button
              onClick={handleBank}
              disabled={!canBank || loading || bankLoading}
              className="w-full"
            >
              {bankLoading ? 'Banking...' : '🏦 Bank'}
            </Button>
          </div>
        </div>

        {/* Apply Banked Credit */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="font-semibold text-foreground mb-4">Apply Banked Credit</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amount to Apply (tonnes)
              </label>
              <input
                type="number"
                value={applyAmount}
                onChange={e => setApplyAmount(Number(e.target.value))}
                disabled={!canApply || loading || applyLoading}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground disabled:opacity-50"
                min="0"
              />
            </div>
            <Button
              onClick={handleApply}
              disabled={!canApply || loading || applyLoading}
              className="w-full"
            >
              {applyLoading ? 'Applying...' : '✨ Apply'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
