import React, { useState, useEffect } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import ProjectionDisplay from './components/ProjectionDisplay';
import RetirementChart from './components/RetirementChart'; // Assuming this is the correct path
import Footer from './components/Footer'; // Import Footer
import ThemeToggle from './components/ThemeToggle'; // Import ThemeToggle
import { calculateRetirementProjection } from './utils/calculator';

function App() {
  const [projection, setProjection] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Apply theme on initial load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      // default to light if no theme or theme is light
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light'); 
    }
  }, []);

  const handleCalculation = (data) => {
    const result = calculateRetirementProjection(data);
    setProjection(result);

    const newChartData = {
      labels: result.annualData.map(d => `Year ${d.year}`),
      datasets: [
        {
          label: 'Savings Balance',
          data: result.annualData.map(d => d.savingsBalance),
          borderColor: document.documentElement.classList.contains('dark') ? '#60A5FA' : '#3B82F6', // brand-primary or dark-brand-primary
          backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.5)',
          fill: true,
          tension: 0.1,
        },
      ],
    };
    setChartData(newChartData);
  };
  
  // Effect to update chart colors when theme changes
  useEffect(() => {
    if (projection) { // only update if there's data
      handleCalculation(projection.inputs); // Re-calculate/re-prepare chart data with current theme
    }
  }, [localStorage.getItem('theme')]); // Re-run when theme changes - listen to local storage or a state variable if possible

  return (
    <div className="min-h-screen bg-brand-light-bg dark:bg-dark-brand-light-bg flex flex-col items-center text-brand-dark-text dark:text-dark-brand-dark-text transition-colors duration-300 ease-in-out">
      <header className="w-full bg-brand-primary dark:bg-dark-brand-primary text-white py-6 shadow-md transition-colors duration-300 ease-in-out">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div>
            <h1 className="text-4xl font-bold text-center">RetireLah!</h1>
            <p className="text-center text-lg mt-2">Your Malaysian Retirement Planner</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl p-6 space-y-8">
        <InputForm onCalculate={handleCalculation} />
        {projection && chartData && (
          <>
            <ProjectionDisplay projection={projection} />
            <div className="bg-brand-card-bg dark:bg-dark-brand-card-bg shadow-card-lg rounded-xl p-6 transition-colors duration-300 ease-in-out">
              <h2 className="text-2xl font-semibold text-brand-dark-text dark:text-dark-brand-dark-text mb-4 text-center transition-colors duration-300 ease-in-out">Savings Projection Chart</h2>
              <RetirementChart chartData={chartData} />
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
