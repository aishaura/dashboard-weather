import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#0f172a",
        bgSecondary: "#1e293b",
        bgCard: "#1e293b",
        borderDark: "#334155",
        textPrimary: "#f1f5f9",
        textSecondary: "#94a3b8",
        accentBlue: "#38bdf8",
        accentGreen: "#4ade80",
        warning: "#fbbf24",
        danger: "#f87171",
      },
    },
  },
  plugins: [],
};

export default config;
