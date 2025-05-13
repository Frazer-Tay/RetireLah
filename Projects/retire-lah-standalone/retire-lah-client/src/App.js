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
    // Use a timeout to simulate async operation and allow UI to update loading state
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
    }, 10); // Short delay for UX
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
      <header className="bg-brand-primary text-white py-6 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 md:h-10 md:w-10 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.759 11.515a4.406 4.406 0 00-1.423-3.882 4.406 4.406 0 00-3.882-1.423A4.406 4.406 0 00.93 7.633a4.406 4.406 0 001.423 3.882M21 11.515a4.406 4.406 0 01-1.423-3.882 4.406 4.406 0 01-3.882-1.423A4.406 4.406 0 0114.272 7.633a4.406 4.406 0 011.423 3.882M12 18a6 6 0 006-6H6a6 6 0 006 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 18V6.75A2.25 2.25 0 0111.25 4.5h1.5A2.25 2.25 0 0115 6.75V18" /></svg>Retire Lah!</h1>
          <p className="text-sm opacity-90 mt-1">Your F.I.R.E. Planner for Singaporeans</p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow w-full max-w-4xl self-center">
        <InputForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isLoading={isLoading && !projectionData} />
        {error && (<div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert"><div className="flex"><div className="py-1"><svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg></div><div><p className="font-bold">Oops! Calculation Error</p><p className="text-sm">{error}</p></div></div></div>)}
        {isLoading && !projectionData && !error && (<div className="mt-12 text-center flex flex-col items-center justify-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-primary mb-4"></div><p className="text-brand-medium-text text-lg">Crunching the numbers for your future...</p></div>)}
        {!isLoading && projectionData && !error && <ProjectionDisplay data={projectionData} />}
      </main>
      <Footer />
    </div>
  );
}
export default App;