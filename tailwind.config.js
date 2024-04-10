/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        crayola: "#f15c31",
        mutedpink: "#DE5E7C",
        aqua: "#00A9A5",
        lavender: "#4390d0",
        sunrise: "#ee902d",
        salmon: "#e24c57",
        test: "#1F7AC5 ",
        test2: "#F36057",
        test3: "#EE902D "
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'poppins': ['Poppins', 'sans-serif']
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
]
}

