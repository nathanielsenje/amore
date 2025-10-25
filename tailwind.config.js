/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'amore-blue': '#4A90E2',
        'amore-purple': '#9B51E0',
        'amore-green': '#27AE60',
        'amore-orange': '#F2994A',
        'amore-red': '#EB5757',
        'amore-yellow': '#F2C94C',
      }
    },
  },
  plugins: [],
}
