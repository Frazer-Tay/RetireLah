// retire-lah-client/src/components/RetirementChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// CustomTooltip remains the same
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalValue = payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md border border-gray-300 dark:border-gray-600 text-sm opacity-95 transition-colors duration-300 ease-in-out">
        <p className="label font-semibold text-brand-dark-text dark:text-dark-brand-dark-text mb-1.5 transition-colors duration-300 ease-in-out">{`Age: ${label}`}</p>
        {payload.map((entry, index) => (<p key={`item-${index}`} style={{ color: entry.fill }} className="font-medium">{`${entry.name}: SGD ${entry.value.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}</p>))}
        {payload.length > 1 && (<p className="font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-brand-dark-text dark:text-dark-brand-dark-text transition-colors duration-300 ease-in-out">{`Total Value: SGD ${totalValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}`}</p>)}
      </div>
    );
  }
  return null;
};

const RetirementChart = ({ data }) => {
  // Placeholder for no data remains the same
  if (!data || data.length === 0) {
    return (
      <div className="bg-brand-card-bg dark:bg-dark-brand-card-bg p-6 sm:p-8 rounded-xl shadow-card-lg mt-8 sm:mt-10 transition-colors duration-300 ease-in-out">
        <h3 className="text-xl sm:text-2xl font-semibold text-brand-dark-text dark:text-dark-brand-dark-text mb-4 transition-colors duration-300 ease-in-out">Investment Growth Over Time</h3>
        <div className="text-center text-brand-medium-text dark:text-dark-brand-medium-text py-16 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 transition-colors duration-300 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 transition-colors duration-300 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-3 text-lg font-medium transition-colors duration-300 ease-in-out">Enter details to see your projection.</p>
        </div>
      </div>
    );
  }

  const formatYAxis = (tickItem) => `SGD ${tickItem / 1000}k`;
  const lastAge = data[data.length - 1]?.age || 'N/A';

  const chartCapitalColor = document.documentElement.classList.contains('dark') ? '#718096' : '#A0AEC0'; // Adjusted for dark
  const chartGainsColor = document.documentElement.classList.contains('dark') ? '#48BB78' : '#68D391'; // Adjusted for dark
  const brandMediumTextColor = document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#4B5563'; // Gray-300 for dark
  const brandLightTextColor = document.documentElement.classList.contains('dark') ? '#9CA3AF' : '#6B7280';  // Gray-400 for dark

  const numYears = data.length;
  let xAxisInterval = "preserveStartEnd"; 
  if (numYears > 30) { // Be more aggressive with skipping for very long horizons
    xAxisInterval = Math.floor(numYears / 10); 
  } else if (numYears > 15) {
    xAxisInterval = Math.floor(numYears / 15); // Aim for ~15 ticks
  } else if (numYears > 8) {
    xAxisInterval = 1; // Show every other
  }
  // For < 8 years, "preserveStartEnd" or 0 (show all) will likely be fine

  return (
    <div className="bg-brand-card-bg dark:bg-dark-brand-card-bg p-4 sm:p-6 rounded-xl shadow-card-lg mt-8 sm:mt-10 transition-colors duration-300 ease-in-out">
      <h3 className="text-xl sm:text-2xl font-semibold text-brand-dark-text dark:text-dark-brand-dark-text mb-1 transition-colors duration-300 ease-in-out">Investment Growth Over Time</h3>
      <p className="text-xs text-brand-light-text dark:text-dark-brand-light-text mb-6 transition-colors duration-300 ease-in-out">Projected values until retirement age {lastAge}.</p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={data} 
          margin={{ 
            top: 10, 
            right: 10, 
            left: 20, 
            bottom: 55 // Generous bottom margin for legend and X-axis label
          }} 
          barGap={4} 
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke={document.documentElement.classList.contains('dark') ? '#4B5563' : '#e5e7eb'}/>
          <XAxis 
            dataKey="age" 
            label={{ 
              value: 'Age', 
              position: 'insideBottom', 
              dy: 40, // Push "Age" label significantly down from the X-axis line
              style: {fontSize: '0.875rem', fill: brandMediumTextColor, fontWeight: 500, fontFamily: 'Inter'} 
            }} 
            tick={{fontSize: '0.75rem', fill: brandLightTextColor, fontFamily: 'Inter'}}
            interval={xAxisInterval}
            padding={{ left: 10, right: 10 }}
            // tickMargin={5} // Space between tick text and X-axis line
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            label={{ value: 'SGD Value', angle: -90, position: 'insideLeft', dx: -15, style: {fontSize: '0.875rem', fill: brandMediumTextColor, fontWeight: 500, fontFamily: 'Inter'} }}
            tick={{fontSize: '0.75rem', fill: brandLightTextColor, fontFamily: 'Inter'}}
            width={75} 
            tickCount={7} 
            domain={[0, dataMax => Math.ceil(dataMax / 100000) * 100000 + 50000]} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: document.documentElement.classList.contains('dark') ? 'rgba(75, 85, 99, 0.4)' : 'rgba(209, 213, 219, 0.4)' }}/>
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="square" 
            iconSize={10}
            // The 'y' prop for Legend specifies the y-coordinate of the legend's top-left corner.
            // We can use this for more precise vertical positioning if wrapperStyle isn't enough.
            // However, it might require calculating based on chart height.
            // Let's try adjusting wrapperStyle first.
            wrapperStyle={{
              fontSize: '0.875rem', 
              fontFamily: 'Inter',
              color: brandMediumTextColor, // Apply themed text color to legend
              // This paddingTop creates space between the X-axis ticks area and the legend.
              paddingTop: 10, 
              // Adding a bottom margin to the legend itself to push the X-axis label further down IF NEEDED
              // marginBottom: 10, // This might push the X-axis label down if it's flowing after.
            }}
            // You can also explicitly set the `y` coordinate of the legend.
            // For example, if chart height is 400 and bottom margin is 55,
            // then the plot area ends around 400 - 55 = 345.
            // We want legend below X-axis ticks. X-axis ticks might take up ~20px.
            // So, legend could start around y={345 - 20 - legendHeight}.
            // This is more complex to calculate dynamically.
            // Let's rely on flow and BarChart margin for now.
            payload={[
                { value: 'Capital Invested', type: 'square', id: 'ID01', color: chartCapitalColor },
                { value: 'Capital Gains', type: 'square', id: 'ID02', color: chartGainsColor },
            ]}
          />
          <Bar dataKey="capitalInvested" stackId="a" name="Capital Invested" fill={chartCapitalColor} radius={[4, 4, 0, 0]} />
          <Bar dataKey="capitalGains" stackId="a" name="Capital Gains" fill={chartGainsColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RetirementChart;