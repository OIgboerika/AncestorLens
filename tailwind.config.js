/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ancestor: {
          primary: "#2D4A3E",
          secondary: "#8B7355",
          accent: "#D4AF37",
          light: "#F5F5DC",
          dark: "#1A2F26",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
