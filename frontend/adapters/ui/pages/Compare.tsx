/**
 * Compare Page
 * Main page for the Compare tab
 */

import { useComparison } from '../hooks/useComparison';
import { Container } from '../components/Container';
import { ComparisonTable } from './compare/ComparisonTable';
import { ComparisonCharts } from './compare/ComparisonCharts';

export const Compare = () => {
  const { comparisonData, loading, error, targetIntensity } = useComparison();

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">Compare Routes</h2>
          <p className="mt-1 text-muted-foreground">
            Analyze baseline vs comparison routes and their compliance status
          </p>
        </div>

        {/* Target Info */}
        <div className="rounded-lg border border-info/30 bg-info/10 p-4">
          <h3 className="font-semibold text-info">Compliance Target</h3>
          <p className="mt-1 text-info">
            {targetIntensity} gCO₂e/MJ (2% below 91.16)
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg border border-error/30 bg-error/10 p-4 text-error">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">Comparison Data</h3>
          <ComparisonTable comparisonData={comparisonData} loading={loading} />
        </div>

        {/* Charts */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-foreground">GHG Intensity Comparison</h3>
          <ComparisonCharts comparisonData={comparisonData} targetIntensity={targetIntensity} />
        </div>
      </div>
    </Container>
  );
};
