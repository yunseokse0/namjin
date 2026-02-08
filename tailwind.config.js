/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#7c3aed',
          dark: '#6d28d9',
          blue: '#3b82f6',
        },
      },
      boxShadow: {
        soft: '0 10px 25px -10px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
}
