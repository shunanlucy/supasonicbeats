import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          cyan: "#00F2FE",
          purple: "#9d4edd",
          pink: "#ff007f",
          emerald: "#10b981",
          gold: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
