/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crayola: "#f15c31",
        aqua: "#01A791",
        sun: "#98a250",
        crayola2: "#f0933e",
        mutedpink: "#DE5E7C",
        lavender: "#4390d0",
        sunrise: "#ee902d",
        salmon: "#e24c57"
        /*crayola: "#E1733D",
        lavender: "#7684BC",
        mutedpink: "#DE5E7C"
        */
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'poppins': ['Poppins', 'sans-serif']
      },
    },
  },
  plugins: [],
}

