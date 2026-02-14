/**
 * ComparisonTable Component
 * Displays baseline vs comparison routes with compliance metrics
 */

import type { ComparisonData } from '../../hooks/useComparison';
import { StatusBadge } from '../../components/StatusBadge';

interface ComparisonTableProps {
  comparisonData: ComparisonData[];
  loading: boolean;
}

export const ComparisonTable = ({ comparisonData, loading }: ComparisonTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading comparison data...</p>
      </div>
    );
  }

  if (comparisonData.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No comparison data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Route ID</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Baseline GHG (gCO₂e/MJ)</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Comparison GHG (gCO₂e/MJ)</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">% Difference</th>
            <th className="px-4 py-3 text-center font-semibold text-foreground">Compliant</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {comparisonData.map((item, index) => (
            <tr key={`${item.baseline.routeId}-${index}`} className="hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-medium text-foreground">{item.baseline.routeId}</td>
              <td className="px-4 py-3 text-center text-foreground">
                {item.baseline.ghgIntensity.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center font-medium text-foreground">
                {item.comparison.ghgIntensity.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={item.percentDifference < 0 ? 'text-success font-medium' : 'text-error font-medium'}>
                  {item.percentDifference > 0 ? '+' : ''}{item.percentDifference.toFixed(2)}%
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <StatusBadge compliant={item.compliant} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
