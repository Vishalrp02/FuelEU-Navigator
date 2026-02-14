/**
 * PoolSumIndicator Component
 * Visual indicator for pool total CB (red/green based on validity)
 */

interface PoolSumIndicatorProps {
  total: number;
  isValid: boolean;
}

export const PoolSumIndicator = ({ total, isValid }: PoolSumIndicatorProps) => {
  return (
    <div className="rounded-lg border-2 border-border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground mb-2">Pool Sum (Adjusted CB)</p>
      <div className="flex items-center justify-between">
        <div className="text-4xl font-bold" style={{
          color: isValid ? 'hsl(var(--success))' : 'hsl(var(--error))'
        }}>
          {total}
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${
            isValid ? 'text-success' : 'text-error'
          }`}>
            {isValid ? '✅ Valid' : '❌ Invalid'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isValid ? 'Pool is viable' : 'Pool needs adjustment'}
          </p>
        </div>
      </div>
    </div>
  );
};
