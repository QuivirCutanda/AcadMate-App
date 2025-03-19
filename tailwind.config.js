/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: "#005596",
        accent :"hsl(206, 100%, 70%)",
        light: "hsl(206, 100%, 90%)",
        background:{
          ligth:"#E0E0E0",
        }
      },
     
    },
  },
  plugins: [],
};
