/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00D4B4',      // Vivid Teal
        accent: '#FF6B6B',       // Coral Peach
        success: '#51CF66',      // Lime Green
        warning: '#FFB74D',      // Warm Amber
        danger: '#FF5252',       // Soft Coral Red
      },
      boxShadow: {
        'glow-teal': '0 0 20px rgba(0,212,180,0.4)',
        'glow-coral': '0 0 20px rgba(255,107,107,0.4)',
      },
      backdropBlur: {
        'xl': '20px',
      },
    },
  },
  plugins: [],
}