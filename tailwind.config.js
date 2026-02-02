/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'psu-1': '#ef4444',
        'psu-2': '#3b82f6',
        'psu-3': '#22c55e',
        'water': '#06b6d4',
        'case': '#1f2937',
        'component': '#374151',
      },
    },
  },
  plugins: [],
}
