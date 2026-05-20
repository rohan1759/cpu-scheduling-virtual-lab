/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        secondary: "#00D4FF",
        dark: "#0B1120",
      },
      boxShadow: {
        glow: "0 0 25px rgba(108,99,255,0.5)",
      },
    },
  },
  plugins: [],
}

