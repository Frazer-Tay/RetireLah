// retire-lah-client/src/components/RetirementChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalValue = payload.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <div className="bg-px-bg p-2 border-2 border-px-border shadow-pixel-sm text-xs opacity-95 font-pixel">
        <p className="label font-normal text-px-accent mb-1">{`Age: ${label}`}</p>
        {payload.map((entry, index) => (<p key={`item-${index}`} style={{ color: entry.fill }} className="font-normal">{`${entry.name}: SGD ${entry.value.toLocaleString()}`}</p>))}
        {payload.length > 1 && (<p className="font-normal mt-1 pt-1 border-t-2 border-px-border text-px-text">{`Total: SGD ${totalValue.toLocaleString()}`}</p>)}
      </div>
    );
  }
  return null;
};

const RetirementChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="card-pixel mt-6 sm:mt-8 py-10 text-center">
        <h3 className="text-md sm:text-lg font-normal text-px-accent mb-3 uppercase">Growth Over Time</h3>
        {/* Pixel art style placeholder for chart */}
        <div className="w-full h-48 bg-px-bg border-2 border-px-border flex items-center justify-center text-px-text-dim">
          <p>[ CALCULATE TO SEE CHART ]</p>
        </div>
      </div>
    );
  }
  const formatYAxis = (tickItem) => `${tickItem / 1000}k`;
  const lastAge = data[data.length - 1]?.age || 'N/A';

  return (
    <div className="card-pixel mt-6 sm:mt-8 p-4">
      <h3 className="text-md sm:text-lg font-normal text-px-accent mb-1 uppercase">Growth Over Time</h3>
      <p className="text-[10px] text-px-text-dim mb-4 leading-tight">Projection until age {lastAge}.</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 0, left: -25, bottom: 20 }} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="0" stroke={false} horizontal={true} vertical={false} strokeOpacity={0.2} />
          <XAxis 
            dataKey="age" 
            tick={{ fontSize: '10px', fill: 'var(--color-px-text-dim)', fontFamily: '"Press Start 2P"' }} 
            axisLine={{ stroke: 'var(--color-px-border)', strokeWidth: 2 }}
            tickLine={{ stroke: 'var(--color-px-border)', strokeWidth: 2 }}
            interval="preserveStartEnd" 
            dy={10}
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            tick={{ fontSize: '10px', fill: 'var(--color-px-text-dim)', fontFamily: '"Press Start 2P"' }}
            axisLine={{ stroke: 'var(--color-px-border)', strokeWidth: 2 }}
            tickLine={{ stroke: 'var(--color-px-border)', strokeWidth: 2 }}
            width={55} // Adjusted width
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-px-accent)', fillOpacity: 0.1 }}/>
          <Legend 
            wrapperStyle={{fontSize: '10px', paddingTop: '10px', fontFamily: '"Press Start 2P"'}} 
            verticalAlign="bottom"
            iconSize={8}
          />
          <Bar dataKey="capitalInvested" stackId="a" name="Capital" fill="var(--color-chart-capital)" radius={0} /> {/* No radius for pixel art */}
          <Bar dataKey="capitalGains" stackId="a" name="Gains" fill="var(--color-chart-gains)" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default RetirementChart;