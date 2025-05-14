// retire-lah-client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Your global styles
import App from './App';
import reportWebVitals from './reportWebVitals';
import ReactGA from 'react-ga4'; // Import the package

const GA_MEASUREMENT_ID = "G-RTJ8TQVWSZ"; // YOUR Measurement ID

// Initialize GA4 only if a valid Measurement ID is provided
// This check prevents errors if ID is accidentally left as a placeholder or is invalid
if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith("G-")) {
  try {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      // You can add testMode: process.env.NODE_ENV === 'test' if you have tests
    });
    
    // Send initial pageview for the app load.
    ReactGA.send({ 
      hitType: "pageview", 
      page: window.location.pathname + window.location.search, // Captures the current path
      title: document.title || "RetireLah App Loaded" // Uses the document title or a fallback
    });
    console.log("GA Initialized and initial pageview sent. ID:", GA_MEASUREMENT_ID);
  } catch (error) {
    console.error("Error initializing Google Analytics:", error);
  }
} else if (process.env.NODE_ENV === 'development') { 
  console.warn("Google Analytics Measurement ID is not set or is invalid. Tracking is disabled. Please replace 'G-RTJ8TQVWSZ' with your actual ID in src/index.js if this is not intended.");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();