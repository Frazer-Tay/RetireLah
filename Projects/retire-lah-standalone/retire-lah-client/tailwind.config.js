/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3B82F6', // Blue-500
        'brand-primary-dark': '#2563EB', // Blue-600
        'brand-secondary': '#10B981', // Emerald-500
        'brand-light-bg': '#F3F4F6', // Gray-100
        'brand-card-bg': '#FFFFFF', // White
        'brand-dark-text': '#1F2937', // Gray-800
        'brand-medium-text': '#4B5563', // Gray-600
        'brand-light-text': '#6B7280', // Gray-500
        'chart-capital': '#A7C7E7',
        'chart-gains': '#77DD77',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}