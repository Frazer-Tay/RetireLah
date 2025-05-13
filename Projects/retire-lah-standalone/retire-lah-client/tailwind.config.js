/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Pixel Art Palette (example, can be tweaked)
        'px-bg': '#222034',      // Dark purple/blue background
        'px-bg-light': '#302C42',// Lighter background for cards
        'px-text': '#FFF1E8',    // Off-white text
        'px-text-dim': '#9BADB7',// Dimmer text
        'px-primary': '#FF007F', // Bright Pink/Magenta
        'px-secondary': '#00E436',// Bright Green
        'px-accent': '#FFCC00',  // Bright Yellow
        'px-border': '#141220',  // Very dark border
        'chart-capital': '#4267B2', // Blue for capital
        'chart-gains': '#00A436',   // Green for gains
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // Fallback
        pixel: ['"Press Start 2P"', 'monospace', 'cursive'], // Pixel font
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px #141220', // Pixelated shadow
        'pixel-sm': '2px 2px 0px 0px #141220',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem', // Minimal rounding if any
        'DEFAULT': '0',   // Default to no rounding
        'md': '0',
        'lg': '0',
        'xl': '0',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // or 'base' if you prefer global styles
    }),
  ],
}