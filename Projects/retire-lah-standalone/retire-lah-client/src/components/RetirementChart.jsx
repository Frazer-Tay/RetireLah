// retire-lah-client/src/components/RetirementChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalValue = payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className="bg-white p-3 shadow-lg rounded-md border border-gray-300 text-sm opacity-95">
        <p className="label font-semibold text-brand-dark-text mb-1.5">{`Age: ${label}`}</p>
        {payload.map((entry, index) => (<p key={`item-${index}`} style={{ color: entry.fill }} className="font-medium">{`${entry.name}: SGD ${entry.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}</p>))}
        {payload.length > 1 && (<p className="font-bold mt-2 pt-2 border-t border-gray-200 text-brand-dark-text">{`Total Value: SGD ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}</p>)}
      </div>
    );
  }
  return null;
};

const RetirementChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-brand-card-bg p-6 sm:p-8 rounded-xl shadow-card-lg mt-8 sm:mt-10">
        <h3 className="text-xl sm:text-2xl font-semibold text-brand-dark-text mb-4">Investment Growth Over Time</h3>
        <div className="text-center text-brand-medium-text py-16 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-3 text-lg font-medium">Enter details to see your projection.</p>
        </div>
      </div>
    );
  }
  const formatYAxis = (tickItem) => `SGD ${tickItem / 1000}k`;
  const lastAge = data[data.length - 1]?.age || 'N/A';

  const chartCapitalColor = '#A0AEC0'; 
  const chartGainsColor = '#68D391';   
  const brandMediumTextColor = '#4B5563'; 
  const brandLightTextColor = '#6B7280'; 

  // Calculate X-axis interval dynamically
  // Aim for around 10-15 ticks on X-axis for readability
  const numYears = data.length;
  let xAxisInterval = "preserveStartEnd"; // Default
  if (numYears > 25) {
    xAxisInterval = Math.floor(numYears / 15); // Show roughly 15 ticks
  } else if (numYears > 15) {
    xAxisInterval = 1; // Show every other tick
  }
  // For very short horizons, "preserveStartEnd" or 0 (show all) might be fine
  // If interval is 0, it shows all ticks.

  return (
    <div className="bg-brand-card-bg p-4 sm:p-6 rounded-xl shadow-card-lg mt-8 sm:mt-10">
      <h3 className="text-xl sm:text-2xl font-semibold text-brand-dark-text mb-1">Investment Growth Over Time</h3>
      <p className="text-xs text-brand-light-text mb-6">Projected values until retirement age {lastAge}.</p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 10, left: 20, bottom: 40 }} // Increased bottom margin for X-axis label
          barGap={4} 
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
          <XAxis 
            dataKey="age" 
            label={{ value: 'Age', position: 'insideBottom', dy: 30, style: {fontSize: '0.875rem', fill: brandMediumTextColor, fontWeight: 500} }} 
            tick={{fontSize: '0.75rem', fill: brandLightTextColor}} // Slightly smaller tick font
            interval={xAxisInterval} // Dynamically calculated interval
            // angle={numYears > 20 ? -30 : 0} // Optionally rotate if many years
            // dx={numYears > 20 ? -5 : 0}     // Adjust dx if rotating
            // dy={numYears > 20 ? 5 : 0}      // Adjust dy if rotating
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            label={{ value: 'SGD Value', angle: -90, position: 'insideLeft', dx: -15, style: {fontSize: '0.875rem', fill: brandMediumTextColor, fontWeight: 500} }}
            tick={{fontSize: '0.75rem', fill: brandLightTextColor}} // Slightly smaller tick font
            width={75} // Slightly more width for Y-axis labels
            tickCount={7} // Suggest around 7 ticks for Y-axis
            domain={[0, dataMax => Math.ceil(dataMax / 100000) * 100000 + 50000]} // Ensure y-axis max is rounded up nicely and has some padding
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(209, 213, 219, 0.4)' }}/>
          <Legend 
            wrapperStyle={{fontSize: '0.875rem', paddingTop: '15px', paddingBottom: '5px'}} 
            verticalAlign="bottom" 
            iconType="square" 
            iconSize={10}
          />
          <Bar dataKey="capitalInvested" stackId="a" name="Capital Invested" fill={chartCapitalColor} radius={[4, 4, 0, 0]} />
          <Bar dataKey="capitalGains" stackId="a" name="Capital Gains" fill={chartGainsColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RetirementChart;