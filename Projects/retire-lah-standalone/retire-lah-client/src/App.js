// retire-lah-client/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import InputForm from './components/InputForm';
import ProjectionDisplay from './components/ProjectionDisplay';
import Footer from './components/Footer';
import { calculateRetirement } from './utils/calculator'; // Assuming this is correct

function App() {
  const [formData, setFormData] = useState({
    currentAge: 30,
    retirementAge: 55,
    lifestyle: 'moderate',
    instrument: 'spy',
  });
  const [projectionData, setProjectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateProjection = useCallback((dataToCalculate) => {
    setIsLoading(true);
    setError(null);
    // Simulating a slight delay for better UX, can be removed if calculations are instant
    setTimeout(() => {
        try {
            const result = calculateRetirement(dataToCalculate); // Ensure this function is robust
            setProjectionData(result);
        } catch (err) {
            setError(err.message || "An error occurred during calculation. Please check inputs.");
            setProjectionData(null); // Clear old data on error
        } finally {
            setIsLoading(false);
        }
    }, 100); // 100ms delay
  }, []); // No dependencies needed if calculateRetirement is pure and setters are stable

  useEffect(() => {
    // Initial calculation based on common scenario or screenshot
    const initialData = { currentAge: 30, retirementAge: 50, lifestyle: 'moderate', instrument: 'spy' };
    setFormData(initialData); // Set form to reflect what will be calculated
    generateProjection(initialData);
  }, [generateProjection]); // generateProjection is stable

  const handleSubmit = (e) => {
    e.preventDefault();
    // The formData from state is already up-to-date due to controlled inputs
    generateProjection(formData);
  };

  // Modern Header Icon
  const HeaderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-9 md:h-10 mr-3 text-white opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col bg-brand-light-bg">
      <header className="bg-brand-primary text-white py-5 sm:py-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center justify-center tracking-tight">
            <HeaderIcon />
            Retire Lah!
          </h1>
          <p className="text-sm sm:text-base opacity-90 mt-1">Your F.I.R.E. Planner for Singaporeans</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-10 flex-grow w-full max-w-4xl xl:max-w-5xl self-center">
        <InputForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isLoading={isLoading && !projectionData} />
        
        {error && (
          <div className="mt-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
            <div className="flex">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg>
              </div>
              <div>
                <p className="font-bold text-red-800">Calculation Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !projectionData && !error && ( // Only show big loader on initial load or if no data
           <div className="mt-12 text-center flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-brand-primary mb-6"></div>
              <p className="text-brand-medium-text text-lg sm:text-xl font-medium">Crunching the numbers...</p>
           </div>
        )}
        
        {/* Render ProjectionDisplay if not in initial loading OR if data is present, even if a subsequent calculation is loading */}
        {(!isLoading || projectionData) && !error && <ProjectionDisplay data={projectionData} />}
      </main>
      
      <Footer />
    </div>
  );
}
export default App;