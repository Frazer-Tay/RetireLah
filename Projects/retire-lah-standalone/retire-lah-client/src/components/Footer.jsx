// retire-lah-client/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-10 mt-16 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-brand-card-bg transition-colors duration-300 ease-in-out">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <img
            src="https://www.wandering-bird.com/wp-content/uploads/2021/11/winter-motorhome-trip-tips.jpg" // Your chosen image
            alt="Inspiring journey towards financial independence"
            className="mx-auto h-40 md:h-48 w-auto max-w-xs md:max-w-sm object-cover rounded-lg shadow-xl"
            onError={(e) => { e.target.style.display='none'; /* Hide if image fails to load */ }}
          />
        </div>
        <p className="text-sm text-brand-medium-text dark:text-dark-brand-medium-text transition-colors duration-300 ease-in-out">
          © {new Date().getFullYear()} Retire Lah! All calculations are estimates.
        </p>
        <p className="text-sm text-brand-medium-text dark:text-dark-brand-medium-text transition-colors duration-300 ease-in-out">
          Always consult with a qualified financial advisor for personalized advice.
        </p>
        <p className="text-xs text-brand-light-text dark:text-dark-brand-light-text mt-3 transition-colors duration-300 ease-in-out">
          Inspired by F.I.R.E. principles for a brighter financial future in Singapore.
        </p>
      </div>
    </footer>
  );
};

export default Footer;