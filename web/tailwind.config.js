/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        valheim: {
          bg: "#0B0E14",
          surface: "#121721",
          card: "#192231",
          border: "#2A364B",
          gold: "#F59E0B",
          goldLight: "#FBBF24",
          goldDark: "#B45309",
          rune: "#38BDF8",
          emerald: "#10B981",
        }
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
