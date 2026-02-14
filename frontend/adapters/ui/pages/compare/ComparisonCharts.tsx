/**
 * ComparisonCharts Component
 * Displays charts comparing GHG intensity values
 */

import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ComparisonData } from '../../hooks/useComparison';
import { Button } from '@/components/ui/button';

interface ComparisonChartsProps {
  comparisonData: ComparisonData[];
  targetIntensity: number;
}

export const ComparisonCharts = ({ comparisonData, targetIntensity }: ComparisonChartsProps) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const chartData = comparisonData.map(item => ({
    routeId: item.baseline.routeId,
    baseline: parseFloat(item.baseline.ghgIntensity.toFixed(2)),
    comparison: parseFloat(item.comparison.ghgIntensity.toFixed(2)),
  }));

  return (
    <div className="space-y-4">
      {/* Chart Type Toggle */}
      <div className="flex gap-2">
        <Button
          onClick={() => setChartType('bar')}
          variant={chartType === 'bar' ? 'default' : 'outline'}
          size="sm"
        >
          📊 Bar Chart
        </Button>
        <Button
          onClick={() => setChartType('line')}
          variant={chartType === 'line' ? 'default' : 'outline'}
          size="sm"
        >
          📈 Line Chart
        </Button>
      </div>

      {/* Chart Container */}
      <div className="rounded-lg border border-border bg-card p-4">
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'bar' ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="routeId" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Legend />
              <Bar
                dataKey="baseline"
                fill="hsl(var(--primary))"
                name="Baseline"
              />
              <Bar
                dataKey="comparison"
                fill="hsl(var(--info))"
                name="Comparison"
              />
              {/* Target line as a bar at the target intensity */}
              <Bar
                dataKey={() => targetIntensity}
                fill="hsl(var(--warning))"
                name={`Target (${targetIntensity})`}
                isAnimationActive={false}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="routeId" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="baseline"
                stroke="hsl(var(--primary))"
                name="Baseline"
              />
              <Line
                type="monotone"
                dataKey="comparison"
                stroke="hsl(var(--info))"
                name="Comparison"
              />
            </LineChart>
          )}
        </ResponsiveContainer>

        {/* Target Line Info */}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: 'hsl(var(--warning))' }} />
          <span>Target: {targetIntensity} gCO₂e/MJ</span>
        </div>
      </div>
    </div>
  );
};
