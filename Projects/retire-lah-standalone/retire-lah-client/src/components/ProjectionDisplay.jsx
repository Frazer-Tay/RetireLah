// retire-lah-client/src/components/ProjectionDisplay.jsx
import React from 'react';
import RetirementChart from './RetirementChart';

// Define Icon components that accept className
const InfoIcon = ({ className = "h-6 w-6 sm:h-7 sm:w-7 mr-3 text-brand-primary" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);
const ChartBarIcon = ({ className = "h-6 w-6 sm:h-7 sm:w-7 mr-3 text-brand-primary" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
    </svg>
);

const Card = ({ children, title, IconComponent, className = "" }) => (
    <div className={`bg-brand-card-bg p-6 sm:p-8 rounded-xl shadow-card-lg ${className}`}>
      {title && (
        <h2 className="text-xl sm:text-2xl font-semibold text-brand-primary mb-4 sm:mb-6 flex items-center">
          {IconComponent && <IconComponent />}
          {title}
        </h2>
      )}
      {children}
    </div>
);

const ProjectionDisplay = ({ data }) => {
  if (!data || !data.assumptions) return null;
  const { targetNestEgg, monthlyInvestmentNeeded, projectionChartData, assumptions } = data;
  
  const formatCurrency = (value, fractionDigits = 2) => {
    if (value === undefined || value === null || value === Infinity || !isFinite(value)) {
      return <span className="text-red-600 font-semibold">N/A (Goal unachievable)</span>;
    }
    return `SGD ${value.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })}`;
  };

  return (
    <div className="mt-8 sm:mt-10 space-y-8 sm:space-y-10">
      <Card title="Your Retirement Snapshot" IconComponent={ChartBarIcon}>
        <p className="text-sm text-brand-light-text mb-6 -mt-3 sm:-mt-4 ml-10">Based on your inputs for retiring at age {assumptions.retirementAge} with {assumptions.lifestyleExpenses}.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200">
            <p className="text-sm font-medium text-blue-700 mb-1.5">Target Nest Egg</p>
            <p className="text-3xl xl:text-4xl font-bold text-brand-secondary">{formatCurrency(targetNestEgg)}</p>
            <p className="text-xs text-blue-600 mt-2 leading-relaxed">Total amount needed by age {assumptions.retirementAge} to fund your desired lifestyle, based on a {assumptions.safeWithdrawalRate} withdrawal rate.</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
            <p className="text-sm font-medium text-green-700 mb-1.5">Monthly Investment Needed</p>
            <p className="text-3xl xl:text-4xl font-bold text-brand-secondary">{formatCurrency(monthlyInvestmentNeeded)}</p>
            <p className="text-xs text-green-600 mt-2 leading-relaxed">Invest this much monthly in {assumptions.instrumentName} to reach your goal, considering estimated returns and fees.</p>
          </div>
        </div>
      </Card>
      
      <Card title="Projection Assumptions" IconComponent={InfoIcon}>
        <ul className="list-disc list-inside text-sm text-brand-medium-text space-y-2 pl-1 sm:pl-3">
          <li>Retiring at Age: <span className="font-semibold text-brand-dark-text">{assumptions.retirementAge}</span> (Investment Horizon: <span className="font-semibold text-brand-dark-text">{assumptions.investmentHorizonYears} years</span>)</li>
          <li>Desired Monthly Lifestyle Cost: <span className="font-semibold text-brand-dark-text">{assumptions.lifestyleExpenses}</span></li>
          <li>Investment Instrument: <span className="font-semibold text-brand-dark-text">{assumptions.instrumentName}</span></li>
          <li>Estimated Gross Annual Return: <span className="font-semibold text-brand-dark-text">{assumptions.grossAnnualReturn}</span></li>
          <li>Instrument Expense Ratio: <span className="font-semibold text-brand-dark-text">{assumptions.expenseRatio}</span></li>
          <li>Estimated Net Annual Return: <span className="font-semibold text-brand-dark-text">{assumptions.netAnnualReturn}</span> (compounded monthly)</li>
          <li>Safe Withdrawal Rate (SWR): <span className="font-semibold text-brand-dark-text">{assumptions.safeWithdrawalRate}</span></li>
          <li className="italic text-xs pt-2 text-brand-light-text">Calculations assume monthly investments are made at the start of each month. Figures are estimates, rounded for clarity, and do not account for taxes or other fees beyond the ETF expense ratio. Past performance is not indicative of future results.</li>
        </ul>
      </Card>

      <RetirementChart data={projectionChartData} />

      <Card title="Investment Fee Information" IconComponent={InfoIcon} className="overflow-hidden"> {/* Added overflow-hidden to card */}
        <p className="text-sm text-brand-medium-text mb-4 -mt-3 sm:-mt-4 ml-10">Expense ratios for the available investment instruments. Lower fees mean more of your money stays invested.</p>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense Ratio</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-brand-dark-text">QQQ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-brand-medium-text">Invesco QQQ Trust</td>
                        <td className="px-6 py-4 whitespace-nowrap text-brand-medium-text">0.20%</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-brand-dark-text">SPY</td>
                        <td className="px-6 py-4 whitespace-nowrap text-brand-medium-text">SPDR S&P 500 ETF Trust</td>
                        <td className="px-6 py-4 whitespace-nowrap text-brand-medium-text">0.0945%</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};
export default ProjectionDisplay;