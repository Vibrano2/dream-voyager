/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'skyblue': '#38BDF8',
          'orange': '#F49129',
          'navy': '#0C1C24',
          'aqua': '#DDF6FA',
        }
      }
    },
  },
  plugins: [],
}
