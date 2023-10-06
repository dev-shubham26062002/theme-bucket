/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'yellow-ochre': '#e8aa3d',
        'yellow-ochre-2': '#e8b53d',
        brown: '#504538',
        charcoal: '#232323',
      },
    },
  },
  plugins: [],
}

