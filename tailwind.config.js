/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2563EB', // Blue 600
        'secondary': '#1D4ED8', // Blue 800
        'light': '#F9FAFB', // Gray 50
        'background': '#F3F4F6', // Gray 100
        'card': '#FFFFFF',
        'text-primary': '#1F2937', // Gray 800
        'text-secondary': '#6B7280', // Gray 500
        'border': '#E5E7EB', // Gray 200
      },
    },
  },
  plugins: [],
}