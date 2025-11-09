/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    boxShadow: {
        purple: "rgba(130,12,184,0.25) 0px 13px 27px -5px, rgba(151,24,186,0.3) 0px 8px 16px -8px",
      },
      backgroundImage:{
        "gradient": "linear-gradient(135deg, #3a0d63 0%, #000000 40%, #000000 100%)",
      },
      fontFamily: {
        oleo: ['"Oleo Script"', 'cursive'],
      },
    },
  },
  plugins: [],
}

