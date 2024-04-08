/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crayola: "#E57238",
        cornblue: "#9C77C9",
        realemerald: "#66B67E",
        pinkk: "#D37C90"
      },
    },
  },
  plugins: [],
}

