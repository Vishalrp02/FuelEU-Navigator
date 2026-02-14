/**
 * CreatePoolForm Component
 * Form to create a pool with selected members
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CreatePoolFormProps {
  selectedCount: number;
  totalCB: number;
  isValid: boolean;
  onSubmit: () => Promise<void>;
  loading?: boolean;
  validationErrors: string[];
}

export const CreatePoolForm = ({
  selectedCount,
  totalCB: _totalCB,
  isValid,
  onSubmit,
  loading = false,
  validationErrors,
}: CreatePoolFormProps) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await onSubmit();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Create Pool</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedCount} ship{selectedCount !== 1 ? 's' : ''} selected
          </p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={selectedCount === 0 || !isValid || loading || submitting}
          size="lg"
        >
          {submitting ? 'Creating...' : '🤝 Create Pool'}
        </Button>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="rounded-lg border border-error/30 bg-error/10 p-3 text-error text-sm space-y-1">
          {validationErrors.map((error, index) => (
            <p key={index}>• {error}</p>
          ))}
        </div>
      )}

      {/* Pool Requirements */}
      <div className="rounded-lg border border-info/30 bg-info/10 p-3 text-info text-sm space-y-1">
        <p className="font-medium">Pool Requirements:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>At least one member must be selected</li>
          <li>Pool sum must be greater than or equal to 0</li>
          <li>Deficit ships cannot exit worse than before pooling</li>
          <li>Surplus ships cannot exit negative after pooling</li>
        </ul>
      </div>
    </div>
  );
};
