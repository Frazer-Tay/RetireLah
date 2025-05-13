// retire-lah-client/src/components/ProjectionDisplay.jsx
import React from 'react';
import RetirementChart from './RetirementChart';

// Define Icon components that accept className
const InfoIcon = ({ className = "h-5 w-5 mr-2 text-px-accent" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 2h12v12H2V2zm2 2v2h1V5h6v1h1V4H4zm0 4v4h1V9h1v3h1V9h1v3h1V9h1v3h1V8H4z M7 6h2v1H7V6z"/> {/* Pixel Info Icon */}
    </svg>
);
const ChartBarIcon = ({ className = "h-5 w-5 mr-2 text-px-accent" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 14h2V2H2v12zm3 0h2V5H5v9zm3 0h2V8H8v6zm3 0h2V4h-2v10z"/> {/* Pixel Chart Icon */}
    </svg>
);


const ProjectionDisplay = ({ data }) => {
  if (!data || !data.assumptions) {
    // This case should ideally be handled by the loading/error state in App.js
    // or RetirementChart's own placeholder if only chart data is missing.
    return null;
  }
  const { targetNestEgg, monthlyInvestmentNeeded, projectionChartData, assumptions } = data;
  
  const formatCurrency = (value, fractionDigits = 2) => {
    if (value === undefined || value === null || value === Infinity || !isFinite(value)) {
      return <span className="text-px-primary text-sm">N/A (Unachievable)</span>;
    }
    // For pixel font, avoid too many decimals if it makes it look cluttered
    const displayFractionDigits = value > 100000 ? 0 : fractionDigits; 
    return `SGD ${value.toLocaleString(undefined, { minimumFractionDigits: displayFractionDigits, maximumFractionDigits: displayFractionDigits })}`;
  };

  const Card = ({ children, title, IconComponent }) => ( // Changed prop name to IconComponent
    <div className="card-pixel space-y-3">
      {title && (
        <h2 className="text-md sm:text-lg font-normal text-px-accent flex items-center uppercase">
          {IconComponent && <IconComponent />} {/* Render the passed component */}
          {title}
        </h2>
      )}
      {children}
    </div>
  );

  return (
    <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
      <Card title="Snapshot" IconComponent={ChartBarIcon}>
        <p className="text-[10px] text-px-text-dim mb-3 -mt-1 leading-tight">Retiring at {assumptions.retirementAge} with {assumptions.lifestyleExpenses.split('(')[0].trim()}.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-px-bg p-3 border-2 border-px-border shadow-pixel-sm">
            <p className="text-xs font-normal text-px-text-dim mb-1 uppercase">Target Nest Egg</p>
            <p className="text-xl xl:text-2xl font-normal text-px-secondary">{formatCurrency(targetNestEgg)}</p>
            <p className="text-[10px] text-px-text-dim mt-1 leading-tight">Total by age {assumptions.retirementAge} ({assumptions.safeWithdrawalRate} SWR).</p>
          </div>
          <div className="bg-px-bg p-3 border-2 border-px-border shadow-pixel-sm">
            <p className="text-xs font-normal text-px-text-dim mb-1 uppercase">Monthly Needed</p>
            <p className="text-xl xl:text-2xl font-normal text-px-secondary">{formatCurrency(monthlyInvestmentNeeded)}</p>
            <p className="text-[10px] text-px-text-dim mt-1 leading-tight">Invest monthly in {assumptions.instrumentName.split('(')[0].trim()}.</p>
          </div>
        </div>
      </Card>
      
      <Card title="Assumptions" IconComponent={InfoIcon}>
        <ul className="list-disc list-inside text-[10px] sm:text-xs text-px-text-dim space-y-1.5 pl-1 leading-snug">
          <li>Age: <span className="text-px-text">{assumptions.currentAge}</span> to <span className="text-px-text">{assumptions.retirementAge}</span> (<span className="text-px-text">{assumptions.investmentHorizonYears} yrs</span>)</li>
          <li>Lifestyle: <span className="text-px-text">{assumptions.lifestyleExpenses.split('(')[0].trim()}</span></li>
          <li>Instrument: <span className="text-px-text">{assumptions.instrumentName.split('(')[0].trim()}</span></li>
          <li>Gross Return: <span className="text-px-text">{assumptions.grossAnnualReturn}</span> (Net: <span className="text-px-text">{assumptions.netAnnualReturn}</span>)</li>
          <li>SWR: <span className="text-px-text">{assumptions.safeWithdrawalRate}</span>. ER: <span className="text-px-text">{assumptions.expenseRatio}</span></li>
          <li className="italic pt-1">Estimates. Does not account for tax/other fees. Past performance not guaranteed.</li>
        </ul>
      </Card>

      <RetirementChart data={projectionChartData} />

      <Card title="Fee Info" IconComponent={InfoIcon}>
        <p className="text-[10px] text-px-text-dim mb-2 -mt-1 leading-tight">Expense Ratios. Lower is better.</p>
        <div className="overflow-x-auto border-2 border-px-border shadow-pixel-sm bg-px-bg">
            <table className="min-w-full text-[10px] sm:text-xs">
                <thead className="border-b-2 border-px-border">
                    <tr>
                        <th scope="col" className="p-1.5 text-left font-normal text-px-text-dim uppercase">Ticker</th>
                        <th scope="col" className="p-1.5 text-left font-normal text-px-text-dim uppercase">Name</th>
                        <th scope="col" className="p-1.5 text-left font-normal text-px-text-dim uppercase">ER</th>
                    </tr>
                </thead>
                <tbody className="text-px-text">
                    <tr className="border-b border-px-border"><td className="p-1.5">QQQ</td><td className="p-1.5">Invesco QQQ</td><td className="p-1.5">0.20%</td></tr>
                    <tr><td className="p-1.5">SPY</td><td className="p-1.5">SPDR S&P500 ETF</td><td className="p-1.5">0.0945%</td></tr>
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};
export default ProjectionDisplay;