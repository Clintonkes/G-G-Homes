import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0A0A0A",
          gold: "#C9A84C",
          "gold-dark": "#8B6914",
          white: "#FFFFFF",
          cream: "#F8F6F1",
          gray: "#6B6B6B",
          "dark-text": "#1A1A1A",
          green: "#1E7E4C",
          red: "#CC2200",
          border: "#E5E0D5",
        },
      },
      fontFamily: {
        sans: [
          "SF Pro Display",
          "SF Pro Text",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(10, 10, 10, 0.12)",
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(201, 168, 76, 0.24), transparent 38%), radial-gradient(circle at bottom right, rgba(10, 10, 10, 0.08), transparent 30%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
