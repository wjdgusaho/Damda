/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        victoria: {
          50: "#f3f5fb",
          100: "#e4e6f5",
          200: "#cfd4ee",
          300: "#aeb8e2",
          400: "#8793d3",
          500: "#6a72c7",
          600: "#575ab9",
          700: "#4e4ca9",
          800: "#48448d",
          900: "#3b396f",
          950: "#282645",
        },
        lilac: {
          50: "#fbf8fc",
          100: "#f6eef9",
          200: "#efe0f4",
          300: "#e2c7eb",
          400: "#cfa3dd",
          500: "#bc7fcd",
          600: "#a862bb",
          700: "#914ea2",
          800: "#794485",
          900: "#63376c",
          950: "#441f4c",
        },
      },
      fontFamily: {
        pretendard: ["pretendard"],
      },
    },
  },
  plugins: [],
}
