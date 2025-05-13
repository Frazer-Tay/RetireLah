// retire-lah-client/src/components/ProjectionDisplay.jsx
import React from 'react';
import RetirementChart from './RetirementChart';

const ProjectionDisplay = ({ data }) => {
  if (!data || !data.assumptions) return null;
  const { targetNestEgg, monthlyInvestmentNeeded, projectionChartData, assumptions } = data;
  const formatCurrency = (value, fractionDigits = 2) => {
    if (value === undefined || value === null || value === Infinity || !isFinite(value)) return 'N/A (Goal may be unachievable with current inputs)';
    return `SGD ${value.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}`;
  };
  return (
    <div className="mt-8 space-y-8">
      <div className="bg-brand-card-bg p-6 md:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-brand-primary mb-2 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-brand-primary" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>Your Retirement Snapshot</h2>
        <p className="text-sm text-brand-light-text mb-6 ml-10">Based on your inputs for retiring at age {assumptions.retirementAge} with {assumptions.lifestyleExpenses}.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-light-bg p-6 rounded-lg shadow-inner"><p className="text-sm text-brand-medium-text mb-1">Target Nest Egg</p><p className="text-3xl font-bold text-brand-secondary">{formatCurrency(targetNestEgg)}</p><p className="text-xs text-brand-light-text mt-2">Total amount needed by age {assumptions.retirementAge} to fund your desired lifestyle, based on a {assumptions.safeWithdrawalRate} withdrawal rate.</p></div>
          <div className="bg-brand-light-bg p-6 rounded-lg shadow-inner"><p className="text-sm text-brand-medium-text mb-1">Monthly Investment Needed</p><p className="text-3xl font-bold text-brand-secondary">{formatCurrency(monthlyInvestmentNeeded)}</p><p className="text-xs text-brand-light-text mt-2">Invest this much monthly in {assumptions.instrumentName} to reach your goal, considering estimated returns and fees.</p></div>
        </div>
      </div>
      <div className="bg-brand-card-bg p-6 md:p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-brand-dark-text mb-3 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brand-medium-text" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>Projection Assumptions</h3>
        <ul className="list-disc list-inside text-sm text-brand-medium-text space-y-1.5 pl-3">
          <li>Retiring at Age: <span className="font-medium">{assumptions.retirementAge}</span> (Investment Horizon: <span className="font-medium">{assumptions.investmentHorizonYears} years</span>)</li>
          <li>Desired Monthly Lifestyle Cost: <span className="font-medium">{assumptions.lifestyleExpenses}</span></li>
          <li>Investment Instrument: <span className="font-medium">{assumptions.instrumentName}</span></li>
          <li>Estimated Gross Annual Return: <span className="font-medium">{assumptions.grossAnnualReturn}</span></li>
          <li>Instrument Expense Ratio: <span className="font-medium">{assumptions.expenseRatio}</span></li>
          <li>Estimated Net Annual Return: <span className="font-medium">{assumptions.netAnnualReturn}</span> (compounded monthly)</li>
          <li>Safe Withdrawal Rate (SWR): <span className="font-medium">{assumptions.safeWithdrawalRate}</span></li>
          <li className="italic text-xs pt-1">Calculations assume monthly investments are made at the start of each month. Figures are estimates, rounded for clarity, and do not account for taxes or other fees beyond the ETF expense ratio. Past performance is not indicative of future results.</li>
        </ul>
      </div>
      <RetirementChart data={projectionChartData} />
      <div className="bg-brand-card-bg p-6 md:p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-brand-dark-text mb-3 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-brand-medium-text" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>Investment Fee Information</h3>
        <p className="text-sm text-brand-medium-text mb-4">Expense ratios for the available investment instruments. Lower fees mean more of your money stays invested.</p>
        <div className="overflow-x-auto rounded-lg border border-gray-200"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense Ratio</th></tr></thead><tbody className="bg-white divide-y divide-gray-200 text-sm"><tr><td className="px-6 py-4 whitespace-nowrap font-medium text-brand-dark-text">QQQ</td><td className="px-6 py-4 whitespace-nowrap text-brand-medium-text">Invesco QQQ Trust</td><td className="px-6 py-4 whitespace-nowrap text-brand-medium-text">0.20%</td></tr><tr><td className="px-6 py-4 whitespace-nowrap font-medium text-brand-dark-text">SPY</td><td className="px-6 py-4 whitespace-nowrap text-brand-medium-text">SPDR S&P 500 ETF Trust</td><td className="px-6 py-4 whitespace-nowrap text-brand-medium-text">0.0945%</td></tr></tbody></table></div>
      </div>
    </div>
  );
};
export default ProjectionDisplay;