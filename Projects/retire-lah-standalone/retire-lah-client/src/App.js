// retire-lah-client/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import InputForm from './components/InputForm';
import ProjectionDisplay from './components/ProjectionDisplay';
import Footer from './components/Footer';
import { calculateMonthlySavingsNeeded, calculateTimeToFIRE } from './utils/calculator';
import ReactGA from 'react-ga4'; // Import ReactGA here

// Define Calculation Modes (keep this)
const CALC_MODES = {
  MONTHLY_SAVINGS: 'calculateMonthlySavings',
  TIME_TO_FIRE: 'calculateTimeToFIRE',
};

function App() {
  // ... (useState hooks for formData, projectionData, etc. remain the same as your last working version) ...
  const initialFormState = { /* ... your initialFormState ... */ currentAge: 30, retirementAge: 55, desiredMonthlyLifestyleToday: 3000, assumedInflationRate: 2.5, initialInvestment: 10000, instrument: 'spy', plannedMonthlyInvestment: 1500,};
  const [calcMode, setCalcMode] = useState(CALC_MODES.MONTHLY_SAVINGS);
  const [formData, setFormData] = useState(initialFormState);
  const [projectionData, setProjectionData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);


  const performCalculation = useCallback((dataToCalculate, mode) => {
    setError(null);
    try {
      let result;
      if (mode === CALC_MODES.MONTHLY_SAVINGS) {
        result = calculateMonthlySavingsNeeded(dataToCalculate);
      } else if (mode === CALC_MODES.TIME_TO_FIRE) {
        result = calculateTimeToFIRE(dataToCalculate);
      } else {
        throw new Error("Invalid calculation mode.");
      }

      if (result) {
        setProjectionData(result);
        // Send GA event for successful calculation
        if (ReactGA.isInitialized) {
          ReactGA.event({
            category: "Retirement_Calculator",
            action: "Calculate_Projection_Success",
            label: `Mode: ${mode}`, // e.g., "Mode: calculateMonthlySavings"
            // value: result.targetNestEgg // Example: track the targetNestEgg value
          });
          console.log(`GA Event Sent: Calculate_Projection_Success, Mode: ${mode}`);
        }
      } else {
         setProjectionData(null); // Should be caught by error handling below ideally
      }
    } catch (err) {
      setError(err.message || "An error occurred during calculation. Please check inputs.");
      setProjectionData(null);
      if (ReactGA.isInitialized) {
        ReactGA.event({
          category: "Retirement_Calculator",
          action: "Calculate_Projection_Error",
          label: `Mode: ${mode} | Error: ${err.message || "Unknown"}`,
        });
        console.log(`GA Event Sent: Calculate_Projection_Error, Mode: ${mode}`);
      }
    }
  }, []); // Dependencies are stable

  // useEffect for initial load (remains the same)
  useEffect(() => {
    const initialCalcData = { ...initialFormState, retirementAge: 50, initialInvestment: 25000 };
    setFormData(initialCalcData);
    setIsCalculating(true);
    setIsInitialLoading(true);
    const timer = setTimeout(() => {
      performCalculation(initialCalcData, CALC_MODES.MONTHLY_SAVINGS);
      setIsCalculating(false);
      setIsInitialLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [performCalculation]);

  // handleSubmit (remains the same)
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsCalculating(true);
    const timer = setTimeout(() => {
      performCalculation(formData, calcMode);
      setIsCalculating(false);
    }, 150);
  };

  const handleModeChange = (newMode) => {
    setCalcMode(newMode);
    setProjectionData(null); 
    setError(null);
    if (ReactGA.isInitialized) {
        ReactGA.event({
            category: "Retirement_Calculator",
            action: "Switch_Mode",
            label: `Switched to: ${newMode}`
        });
        console.log(`GA Event Sent: Switch_Mode to ${newMode}`);
    }
  };

  // HeaderIcon and JSX structure remain the same as your last working version
  const HeaderIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-9 md:h-10 mr-3 text-white opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
  
  return (
    <div className="min-h-screen flex flex-col bg-brand-light-bg">
      <header className="bg-brand-primary text-white py-5 sm:py-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center justify-center tracking-tight"><HeaderIcon />Retire Lah!</h1>
          <p className="text-sm sm:text-base opacity-90 mt-1">Your F.I.R.E. (Financial Independence, Retire Early) planner for Singaporeans.</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 sm:py-10 flex-grow w-full max-w-4xl xl:max-w-5xl self-center">
        <div className="mb-6 flex justify-center space-x-2 sm:space-x-4">
            <button onClick={() => handleModeChange(CALC_MODES.MONTHLY_SAVINGS)} className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${calcMode === CALC_MODES.MONTHLY_SAVINGS ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-brand-primary border border-brand-primary hover:bg-blue-50'}`}>Calculate Monthly Savings</button>
            <button onClick={() => handleModeChange(CALC_MODES.TIME_TO_FIRE)} className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary ${calcMode === CALC_MODES.TIME_TO_FIRE ? 'bg-brand-secondary text-white shadow-md' : 'bg-white text-brand-secondary border border-brand-secondary hover:bg-green-50'}`}>Calculate Time to F.I.R.E.</button>
        </div>
        <InputForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isLoading={isCalculating} calcMode={calcMode} CALC_MODES={CALC_MODES} />
        {error && ( <div className="mt-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert"><div className="flex"><div className="py-1"><svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg></div><div><p className="font-bold text-red-800">Calculation Error</p><p className="text-sm text-red-700">{error}</p></div></div></div>)}
        {isInitialLoading && !error && ( <div className="mt-12 text-center flex flex-col items-center justify-center py-16"><div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-brand-primary mb-6"></div><p className="text-brand-medium-text text-lg sm:text-xl font-medium">Loading Initial Projection...</p></div>)}
        {!isInitialLoading && projectionData && !error && ( <ProjectionDisplay data={projectionData} calcMode={calcMode} CALC_MODES={CALC_MODES}/> )}
        {!isInitialLoading && !projectionData && !error && ( <div className="mt-12 text-center flex flex-col items-center justify-center py-16"><p className="text-brand-medium-text text-lg">Please adjust your plan and calculate, or switch modes.</p></div> )}
      </main>
      <Footer />
    </div>
  );
}
export default App;