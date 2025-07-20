/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Make sure Tailwind scans your files
  ],
  darkMode: 'class', // 👈 This enables manual class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
}
