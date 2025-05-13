// retire-lah-client/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import InputForm from './components/InputForm';
import ProjectionDisplay from './components/ProjectionDisplay';
import Footer from './components/Footer';
import { calculateRetirement } from './utils/calculator';

function App() {
  const [formData, setFormData] = useState({ currentAge: 30, retirementAge: 55, lifestyle: 'moderate', instrument: 'spy' });
  const [projectionData, setProjectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateProjection = useCallback((dataToCalculate) => {
    setIsLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        const result = calculateRetirement(dataToCalculate);
        setProjectionData(result);
      } catch (err) {
        setError(err.message || "An error occurred during calculation.");
        setProjectionData(null);
      } finally {
        setIsLoading(false);
      }
    }, 50); // slightly longer delay for perceived calculation
  }, []);

  useEffect(() => {
    const initialScreenshotData = { currentAge: 30, retirementAge: 50, lifestyle: 'moderate', instrument: 'spy' };
    generateProjection(initialScreenshotData);
    setFormData(initialScreenshotData);
  }, [generateProjection]);

  const handleSubmit = (e) => {
    e.preventDefault();
    generateProjection(formData);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-light-bg">
      <header className="bg-gradient-to-r from-brand-primary to-blue-600 text-white py-6 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold flex items-center justify-center tracking-tight">
            {/* Palm Tree Icon - refined */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 mr-3 opacity-90" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Retire Lah!
          </h1>
          <p className="text-sm sm:text-base opacity-90 mt-1.5">Your F.I.R.E. Planner for Singaporeans</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-10 flex-grow w-full max-w-5xl self-center"> {/* Increased max-width */}
        <InputForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isLoading={isLoading && !projectionData} />
        
        {error && (
          <div className="mt-8 bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md shadow-md" role="alert">
            <div className="flex">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg>
              </div>
              <div>
                <p className="font-bold text-red-800">Oops! Calculation Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !projectionData && !error && (
           <div className="mt-12 text-center flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-primary mb-6"></div>
              <p className="text-brand-medium-text text-xl font-medium">Crunching the numbers for your future...</p>
              <p className="text-brand-light-text text-sm">Hang tight!</p>
           </div>
        )}
        
        {!isLoading && projectionData && !error && <ProjectionDisplay data={projectionData} />}
      </main>
      
      <Footer />
    </div>
  );
}
export default App;