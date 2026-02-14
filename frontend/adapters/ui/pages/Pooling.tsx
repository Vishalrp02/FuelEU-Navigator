/**
 * Pooling Page
 * Main page for the Pooling tab
 */

import { useState } from 'react';
import { usePooling } from '../hooks/usePooling';
import { Container } from '../components/Container';
import { PoolMembersList } from './pooling/PoolMembersList';
import { PoolSumIndicator } from './pooling/PoolSumIndicator';
import { CreatePoolForm } from './pooling/CreatePoolForm';

export const Pooling = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const {
    members,
    selectedMembers,
    loading,
    error,
    validationErrors,
    selectedYear: poolingYear,
    poolId,
    toggleMember,
    createPool,
    setYear,
    getTotalAdjustedCB,
    isPoolValid,
  } = usePooling(selectedYear);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setYear(year);
  };

  const totalCB = getTotalAdjustedCB();
  const isValidSum = totalCB >= 0;

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">Pooling</h2>
          <p className="mt-1 text-muted-foreground">
            Create compliance pools and manage ship contributions (Article 21)
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex gap-2">
          {[2024, 2025].map(year => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                poolingYear === year
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-lg border border-error/30 bg-error/10 p-4 text-error">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Pool Created Alert */}
        {poolId && (
          <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-success">
            <p className="font-medium">Pool Created Successfully</p>
            <p className="text-sm mt-1">Pool ID: {poolId}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Members List */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Available Ships</h3>
              <PoolMembersList
                members={members}
                selectedMembers={selectedMembers}
                onToggleMember={toggleMember}
                loading={loading}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Pool Sum Indicator */}
            <PoolSumIndicator total={totalCB} isValid={isValidSum} />

            {/* Create Pool Form */}
            <CreatePoolForm
              selectedCount={selectedMembers.length}
              totalCB={totalCB}
              isValid={isPoolValid}
              onSubmit={createPool}
              loading={loading}
              validationErrors={validationErrors}
            />
          </div>
        </div>

        {/* Info */}
        <div className="rounded-lg border border-info/30 bg-info/10 p-4 text-info">
          <h4 className="font-semibold mb-2">Article 21 - Pooling Information</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Pooling allows multiple ships to combine their compliance balances</li>
            <li>The sum of all adjusted CBs must be non-negative for a valid pool</li>
            <li>Deficit ships cannot exit in a worse position than they started</li>
            <li>Surplus ships cannot become negative after pooling</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};
