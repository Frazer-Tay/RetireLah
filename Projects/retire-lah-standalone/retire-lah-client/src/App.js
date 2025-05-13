// retire-lah-client/src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import InputForm from './components/InputForm';
import ProjectionDisplay from './components/ProjectionDisplay';
import Footer from './components/Footer';
import { calculateRetirement } from './utils/calculator';

function App() {
  // console.log("App component rendered"); // For debugging re-renders

  const [formData, setFormData] = useState({ currentAge: 30, retirementAge: 55, lifestyle: 'moderate', instrument: 'spy' });
  const [projectionData, setProjectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start true for initial load
  const [error, setError] = useState(null);

  const generateProjection = useCallback((dataToCalculate) => {
    // console.log("generateProjection called with:", dataToCalculate);
    setIsLoading(true);
    setError(null);
    // Simulate a short delay for calculation if it's too fast, otherwise remove setTimeout
    // Using Promise to ensure state updates propagate before next steps if needed,
    // but direct call is usually fine if calculateRetirement is synchronous.
    new Promise(resolve => {
        const result = calculateRetirement(dataToCalculate);
        resolve(result);
    }).then(result => {
        // console.log("Calculation result:", result);
        setProjectionData(result);
    }).catch(err => {
        // console.error("Error in generateProjection:", err);
        setError(err.message || "An error occurred during calculation.");
        setProjectionData(null);
    }).finally(() => {
        // console.log("Setting isLoading to false in generateProjection");
        setIsLoading(false);
    });

  }, []); // Setters are stable, no other dependencies needed for this callback's definition

  useEffect(() => {
    // console.log("Initial load useEffect triggered");
    const initialScreenshotData = { currentAge: 30, retirementAge: 50, lifestyle: 'moderate', instrument: 'spy' };
    generateProjection(initialScreenshotData);
    setFormData(initialScreenshotData); // Set form to reflect initial calculation
  }, [generateProjection]); // generateProjection is stable

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("handleSubmit called with formData:", formData);
    generateProjection(formData); // formData here is the current state from App
  };

  // Header Icon (Pixel Art Style - simple house/up arrow)
  const HeaderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 mr-2" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 14h8v-2H4v2zm2-4h4V8H6v2zm0-3h4V5H6v2zm0-3h4V1H6v2zm-2 9h1V9H4v4zm8 0h1V9h-1v4zM2 15h12v-1H2v1zM0 7h2v политик7H0V7zm14 0h2v7h-2V7z" />
      <path d="M8 0L0 5v1h2v7h1V6h1v7h1V6h2V3h2v3h2V6h1v7h1V6h1v7h2V5L8 0z" transform="scale(0.8) translate(0 1.5)"/> {/* Adjusted scale/translate */}
    </svg>
  );


  return (
    <div className="min-h-screen flex flex-col font-pixel bg-px-bg text-px-text selection:bg-px-accent selection:text-px-bg">
      <header className="bg-px-bg-light text-px-primary py-4 border-b-4 border-px-border shadow-pixel">
        <div className="container mx-auto px-2 sm:px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal flex items-center justify-center tracking-tight">
            <HeaderIcon />
            Retire Lah!
          </h1>
          <p className="text-xs sm:text-sm text-px-text-dim mt-1 uppercase">Your F.I.R.E. Planner</p>
        </div>
      </header>

      <main className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 flex-grow w-full max-w-3xl self-center">
        <InputForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isLoading={isLoading} /> {/* Pass isLoading directly */}
        
        {error && (
          <div className="mt-6 card-pixel text-px-primary border-px-primary p-3" role="alert">
            <p className="font-bold uppercase">Error!</p>
            <p className="text-sm text-px-text">{error}</p>
          </div>
        )}
        
        {isLoading && !projectionData && !error && ( // Only show big loader on initial load
           <div className="mt-10 text-center py-10">
              <div className="inline-block animate-ping h-8 w-8 bg-px-secondary rounded-full mb-4"></div>
              <p className="text-px-text-dim text-lg uppercase">Calculating...</p>
           </div>
        )}
        
        {/* Always try to render ProjectionDisplay if not initial loading phase, it handles its own empty/data states */}
        {(!isLoading || projectionData) && !error && <ProjectionDisplay data={projectionData} />}
        {/* If error and old data exists, you might choose to still show old data or hide it - current setup hides on new error */}

      </main>
      
      <Footer />
    </div>
  );
}
export default App;