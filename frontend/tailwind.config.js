/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
        },
        pink: {
          50: '#fdf2f8',
        },
      },
    },
  },
  plugins: [],
};
