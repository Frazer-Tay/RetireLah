// retire-lah-client/src/components/InputForm.jsx
import React from 'react';

const InputForm = ({ formData, setFormData, onSubmit, isLoading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const processedValue = (name === "currentAge" || name === "retirementAge") && value !== "" ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const ButtonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 2h12v2H2V2zm0 3h12v2H2V5zm0 3h12v2H2V8zm0 3h8v2H2v-2z M11 11h3v3h-3v-3z"/> {/* Simple calc icon */}
    </svg>
  );
  const LoadingIcon = () => (
    <svg className="animate-spin mr-2 h-4 w-4 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );


  return (
    <div className="card-pixel space-y-5">
      <h2 className="text-lg sm:text-xl font-normal text-px-accent flex items-center uppercase">
        {/* Simple briefcase/form icon pixel style */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 16 16">
          <path d="M0 2h16v2H0V2zm0 3h16v фрагменты8H0V5zm2 2v4h12V7H2zm3 1h2v2H5V8zm4 0h2v2H9V8z"/>
        </svg>
        Plan Your Retirement
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <label htmlFor="currentAge" className="block text-xs font-normal text-px-text-dim mb-1 uppercase">Current Age</label>
          <input type="number" name="currentAge" id="currentAge" value={formData.currentAge} onChange={handleChange} min="18" max="99" required placeholder="e.g., 30"/>
        </div>
        <div>
          <label htmlFor="retirementAge" className="block text-xs font-normal text-px-text-dim mb-1 uppercase">Retirement Age</label>
          <input type="number" name="retirementAge" id="retirementAge" value={formData.retirementAge} onChange={handleChange} min={Number(formData.currentAge) + 1 || 19} max="100" required placeholder="e.g., 55"/>
        </div>
      </div>

      <div>
        <label htmlFor="lifestyle" className="block text-xs font-normal text-px-text-dim mb-1 uppercase">Desired Lifestyle</label>
        <select name="lifestyle" id="lifestyle" value={formData.lifestyle} onChange={handleChange} required>
          <option value="moderate">Moderate: SGD 4,910/m</option>
          <option value="basic">Basic: SGD 2,860/m</option>
          <option value="affluent">Affluent: SGD 8,175/m</option>
        </select>
        <p className="mt-1 text-[10px] text-px-text-dim leading-tight">Note: Future adjusted values. General guide.</p>
      </div>

      <div>
        <label htmlFor="instrument" className="block text-xs font-normal text-px-text-dim mb-1 uppercase">Investment</label>
        <select name="instrument" id="instrument" value={formData.instrument} onChange={handleChange} required>
          <option value="spy">SPY (S&P 500, ~10%)</option>
          <option value="qqq">QQQ (Tech, ~13%)</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} onClick={onSubmit} className="w-full btn-pixel text-sm uppercase tracking-wider">
        {isLoading ? <LoadingIcon /> : <ButtonIcon />}
        {isLoading ? 'Calculating...' : 'Calculate'}
      </button>
    </div>
  );
};
export default InputForm;