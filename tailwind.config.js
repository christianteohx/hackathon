/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'indigo-primary': '#6366f1',
        'accent-gold': '#fbbf24', // Tailwind's amber-400, a good starting point for gold/amber
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    }
  },
  plugins: []
};
