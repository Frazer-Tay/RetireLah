// retire-lah-client/src/components/InputForm.jsx
import React from 'react';

const InputForm = ({ formData, setFormData, onSubmit, isLoading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure numeric inputs are treated as numbers, allow empty string for clearing
    const isNumericField = ["currentAge", "retirementAge", "desiredMonthlyLifestyleToday", "assumedInflationRate", "initialInvestment"].includes(name);
    const processedValue = isNumericField && value !== "" ? Number(value) : value;
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const localFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e); 
  };

  return (
    <form onSubmit={localFormSubmit} className="bg-brand-card-bg p-6 sm:p-8 rounded-xl shadow-card-lg space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-brand-primary mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 mr-3 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        Plan Your Retirement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label htmlFor="currentAge" className="block text-sm font-medium text-brand-medium-text mb-1.5">Current Age</label>
          <input type="number" name="currentAge" id="currentAge" value={formData.currentAge} onChange={handleChange} min="18" max="99" required className="py-2.5 px-3.5" placeholder="e.g., 30"/>
        </div>
        <div>
          <label htmlFor="retirementAge" className="block text-sm font-medium text-brand-medium-text mb-1.5">Desired Retirement Age</label>
          <input type="number" name="retirementAge" id="retirementAge" value={formData.retirementAge} onChange={handleChange} min={Number(formData.currentAge) + 1 || 19} max="100" required className="py-2.5 px-3.5" placeholder="e.g., 55"/>
        </div>
      </div>

      <div>
        <label htmlFor="desiredMonthlyLifestyleToday" className="block text-sm font-medium text-brand-medium-text mb-1.5">Desired Monthly Lifestyle (Today's Value, SGD)</label>
        <input type="number" name="desiredMonthlyLifestyleToday" id="desiredMonthlyLifestyleToday" value={formData.desiredMonthlyLifestyleToday} onChange={handleChange} min="100" step="100" required className="py-2.5 px-3.5" placeholder="e.g., 3000"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label htmlFor="initialInvestment" className="block text-sm font-medium text-brand-medium-text mb-1.5">Current Savings/Initial Investment (SGD)</label>
          <input type="number" name="initialInvestment" id="initialInvestment" value={formData.initialInvestment} onChange={handleChange} min="0" step="1000" required className="py-2.5 px-3.5" placeholder="e.g., 25000"/>
        </div>
        <div>
          <label htmlFor="assumedInflationRate" className="block text-sm font-medium text-brand-medium-text mb-1.5">Assumed Annual Inflation (%)</label>
          <input type="number" name="assumedInflationRate" id="assumedInflationRate" value={formData.assumedInflationRate} onChange={handleChange} min="0" max="20" step="0.1" required className="py-2.5 px-3.5" placeholder="e.g., 2.5"/>
        </div>
      </div>
      
      <div>
        <label htmlFor="instrument" className="block text-sm font-medium text-brand-medium-text mb-1.5">Investment Instrument</label>
        <select name="instrument" id="instrument" value={formData.instrument} onChange={handleChange} required className="py-2.5 px-3.5 pr-10">
          <option value="spy">SPY (S&P 500, ~10% Avg. Return)</option>
          <option value="qqq">QQQ (Tech Focused, ~13% Avg. Return)</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center text-base transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
        {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Calculating...</>) : (<><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>Calculate Projection</>)}
      </button>
    </form>
  );
};
export default InputForm;