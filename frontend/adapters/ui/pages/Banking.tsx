/**
 * Banking Page
 * Main page for the Banking tab
 */

import { useState } from 'react';
import { useBanking } from '../hooks/useBanking';
import { Container } from '../components/Container';
import { ComplianceIndicator } from '../components/ComplianceIndicator';
import { BankingActions } from './banking/BankingActions';
import { BankingKpis } from './banking/BankingKpis';

export const Banking = () => {
  const [selectedYear, setSelectedYear] = useState(2024);
  const {
    currentBalance,
    lastOperation,
    loading,
    error,
    selectedYear: bankingYear,
    canBank,
    canApply,
    bankCompliance,
    applyBanked,
    setYear,
  } = useBanking(selectedYear);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setYear(year);
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">Banking</h2>
          <p className="mt-1 text-muted-foreground">
            Manage compliance balance banking operations (Article 20)
          </p>
        </div>

        {/* Year Selector */}
        <div className="flex gap-2">
          {[2024, 2025].map(year => (
            <button
              key={year}
              onClick={() => handleYearChange(year)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                bankingYear === year
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

        {/* Current Balance */}
        {loading && !currentBalance ? (
          <div className="text-center text-muted-foreground py-8">
            Loading balance information...
          </div>
        ) : currentBalance ? (
          <ComplianceIndicator
            value={currentBalance.cb}
            label="Current Compliance Balance"
          />
        ) : null}

        {/* Banking Actions */}
        <BankingActions
          canBank={canBank}
          canApply={canApply}
          onBank={bankCompliance}
          onApply={applyBanked}
          loading={loading}
          error={error}
        />

        {/* Last Operation KPIs */}
        {lastOperation && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-foreground">Last Operation KPIs</h3>
            <BankingKpis operation={lastOperation} />
          </div>
        )}

        {/* Info */}
        <div className="rounded-lg border border-info/30 bg-info/10 p-4 text-info">
          <h4 className="font-semibold mb-2">Article 20 - Banking Information</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Banking allows ships to save positive compliance balance for future years</li>
            <li>Banked surplus can be applied to cover deficits in subsequent years</li>
            <li>Operations are only available when compliance balance is positive</li>
          </ul>
        </div>
      </div>
    </Container>
  );
};
