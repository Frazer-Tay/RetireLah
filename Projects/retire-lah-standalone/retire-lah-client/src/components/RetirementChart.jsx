// retire-lah-client/src/components/RetirementChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalValue = payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-300 text-sm opacity-95">
        <p className="label font-semibold text-brand-dark-text mb-1">{`Age: ${label}`}</p>
        {payload.map((entry, index) => (<p key={`item-${index}`} style={{ color: entry.fill }} className="font-medium">{`${entry.name}: SGD ${entry.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}</p>))}
        {payload.length > 1 && (<p className="font-bold mt-1.5 pt-1.5 border-t border-gray-200 text-brand-dark-text">{`Total Value: SGD ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}</p>)}
      </div>
    );
  }
  return null;
};

const RetirementChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-brand-card-bg p-6 sm:p-8 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 mt-8 sm:mt-10">
        <h3 className="text-xl sm:text-2xl font-semibold text-brand-dark-text mb-4">Investment Growth Over Time</h3>
        <div className="text-center text-brand-medium-text py-16 border-2 border-dashed border-gray-200 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-3 text-lg">Enter your details and click "Calculate Projection" to see your investment growth.</p>
        </div>
      </div>
    );
  }
  const formatYAxis = (tickItem) => `SGD ${tickItem / 1000}k`;
  return (
    <div className="bg-brand-card-bg p-4 sm:p-6 rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 mt-8 sm:mt-10">
      <h3 className="text-xl sm:text-2xl font-semibold text-brand-dark-text mb-1">Investment Growth Over Time</h3>
      <p className="text-xs text-brand-light-text mb-6">Showing cumulative capital invested and capital gains until retirement age {data[data.length-1]?.age || 'N/A'}.</p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 15, bottom: 30 }} barGap={4} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
          <XAxis dataKey="age" 
                 label={{ value: 'Age', position: 'insideBottom', dy: 25, style: {fontSize: '0.875rem', fill: '#4B5563', fontWeight: 500} }} 
                 tick={{fontSize: '0.8rem', fill: '#6B7280'}}
                 interval="preserveStartEnd" 
                 padding={{ left: 10, right: 10 }}/>
          <YAxis tickFormatter={formatYAxis} 
                 label={{ value: 'SGD Value', angle: -90, position: 'insideLeft', dx: -10, style: {fontSize: '0.875rem', fill: '#4B5563', fontWeight: 500} }}
                 tick={{fontSize: '0.8rem', fill: '#6B7280'}}
                 width={70} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(209, 213, 219, 0.3)' }}/>
          <Legend wrapperStyle={{fontSize: '0.875rem', paddingTop: '15px', paddingBottom: '5px'}} verticalAlign="bottom" />
          <Bar dataKey="capitalInvested" stackId="a" name="Capital Invested" fill="#A7C7E7" radius={[4, 4, 0, 0]} />
          <Bar dataKey="capitalGains" stackId="a" name="Capital Gains" fill="#77DD77" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RetirementChart;