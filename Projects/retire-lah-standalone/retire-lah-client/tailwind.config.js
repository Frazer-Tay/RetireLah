/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3B82F6',        // Calming Blue (Blue-500)
        'brand-primary-dark': '#2563EB',   // Darker Blue (Blue-600)
        'brand-secondary': '#10B981',      // Calming Green (Emerald-500)
        'brand-secondary-dark': '#059669', // Darker Green (Emerald-600)
        'brand-light-bg': '#F3F4F6',       // Very Light Gray (Gray-100)
        'brand-card-bg': '#FFFFFF',        // White
        'brand-dark-text': '#1F2937',      // Dark Gray (Gray-800)
        'brand-medium-text': '#4B5563',    // Medium Gray (Gray-600)
        'brand-light-text': '#6B7280',     // Light Gray (Gray-500)
        'chart-capital': '#A0AEC0',        // Neutral Gray for capital (Gray-400/500)
        'chart-gains': '#68D391',          // Softer Green for gains (Green-400)
        'accent-orange': '#F59E0B',        // Amber-500 for subtle accents if needed
        'accent-purple': '#8B5CF6',        // Violet-500 for subtle accents if needed

        // Dark mode specific colors
        'dark-brand-primary': '#60A5FA', // Lighter Blue for dark mode (Blue-400)
        'dark-brand-secondary': '#34D399', // Lighter Green for dark mode (Emerald-400)
        'dark-brand-light-bg': '#1F2937',  // Dark Gray for dark mode background (Gray-800)
        'dark-brand-card-bg': '#374151',   // Medium Dark Gray for dark mode cards (Gray-700)
        'dark-brand-dark-text': '#F3F4F6', // Very Light Gray for dark mode text (Gray-100)
        'dark-brand-medium-text': '#D1D5DB',// Light Gray for dark mode medium text (Gray-300)
        'dark-brand-light-text': '#9CA3AF', // Lighter Gray for dark mode light text (Gray-400)
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem', // 12px
        '2xl': '1rem',   // 16px
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}