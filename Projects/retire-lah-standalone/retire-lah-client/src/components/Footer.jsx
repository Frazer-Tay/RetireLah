// retire-lah-client/src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center py-8 mt-16 border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex justify-center">
          <img src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGZpbmFuY2UlMjBwbGFubmluZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=300&q=60" alt="Financial planning" className="mx-auto h-32 w-auto object-cover rounded-lg shadow-md" onError={(e) => { e.target.style.display='none'; }}/>
        </div>
        <p className="text-sm text-brand-medium-text">© {new Date().getFullYear()} Retire Lah! All calculations are estimates.</p>
        <p className="text-sm text-brand-medium-text">Always consult with a qualified financial advisor for personalized advice.</p>
        <p className="text-xs text-brand-light-text mt-2">Inspired by F.I.R.E. principles for a brighter financial future in Singapore.</p>
      </div>
    </footer>
  );
};
export default Footer;