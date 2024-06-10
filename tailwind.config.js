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
        mariner: "#1F7AC5",
        salmon: "#F36057",
        carrot: "#EE902D",
        white: "#FEFEFD",
        black: "#0B0A0B",
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'poppins': ['Poppins', 'sans-serif']
      },
      screens: {
        'xs': '375px',
        'sm': '640px',  
        'md': '768px',  
        'lg': '1024px',  
        'xl': '1280px',  
        '2xl': '1536px',
      }
  
    }
  },
  plugins: [
    require('flowbite/plugin')
]
}

