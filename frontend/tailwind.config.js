/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        secondary: "#FF6584",
        dark: {
          100: "#1E1E2E",
          200: "#16161F",
          300: "#0D0D14",
        },
      },
      fontFamily: {
        sans: ["'Sora'", "sans-serif"],
        display: ["'Cabinet Grotesk'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
