// retire-lah-client/src/components/RetirementChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200 text-sm">
        <p className="label font-semibold text-brand-dark-text">{`Age: ${label}`}</p>
        {payload.map((entry, index) => (<p key={`item-${index}`} style={{ color: entry.fill }}>{`${entry.name}: SGD ${entry.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}</p>))}
        {payload.length === 2 && (<p className="font-medium mt-1 text-brand-dark-text">{`Total: SGD ${(payload[0].value + payload[1].value).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}</p>)}
      </div>
    );
  }
  return null;
};

const RetirementChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-brand-card-bg p-6 md:p-8 rounded-xl shadow-lg mt-8">
        <h3 className="text-xl font-semibold text-brand-dark-text mb-4">Investment Growth Over Time</h3>
        <p className="text-center text-brand-medium-text py-10">Enter your details and click "Calculate Projection" to see your investment growth.</p>
      </div>
    );
  }
  const formatYAxis = (tickItem) => `SGD ${tickItem / 1000}k`;
  return (
    <div className="bg-brand-card-bg p-4 md:p-6 rounded-xl shadow-lg mt-8">
      <h3 className="text-xl font-semibold text-brand-dark-text mb-6">Investment Growth Over Time</h3>
      <p className="text-xs text-brand-light-text mb-4 -mt-4">Showing cumulative capital invested and capital gains until retirement age {data[data.length-1].age}.</p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
          <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', dy: 20, style: {fontSize: '0.875rem', fill: '#6B7280'} }} tick={{fontSize: '0.75rem', fill: '#6B7280'}} interval="preserveStartEnd" />
          <YAxis tickFormatter={formatYAxis} label={{ value: 'SGD Value', angle: -90, position: 'insideLeft', dx: -15, style: {fontSize: '0.875rem', fill: '#6B7280'} }} tick={{fontSize: '0.75rem', fill: '#6B7280'}} width={80} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 230, 230, 0.3)' }}/>
          <Legend wrapperStyle={{fontSize: '0.875rem', paddingTop: '10px'}} />
          <Bar dataKey="capitalInvested" stackId="a" name="Capital Invested" fill="var(--color-chart-capital)" />
          <Bar dataKey="capitalGains" stackId="a" name="Capital Gains" fill="var(--color-chart-gains)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RetirementChart;

// Add these CSS variables to your index.css or App.css if you prefer
// For simplicity, you can also directly use the hex codes in the fill attribute of <Bar>
// :root {
//   --color-chart-capital: #A7C7E7;
//   --color-chart-gains: #77DD77;
// }