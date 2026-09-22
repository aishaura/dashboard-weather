import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#080d1a",
        bgSecondary: "#0f172a",
        bgCard: "#111a2e",
        borderDark: "rgba(255, 255, 255, 0.08)",
        borderHighlight: "rgba(255, 255, 255, 0.15)",
        textPrimary: "#f8fafc",
        textSecondary: "#94a3b8",
        textMuted: "#64748b",
        accentBlue: "#38bdf8",
        accentSky: "#0ea5e9",
        accentGreen: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      backgroundImage: {
        "atmospheric-gradient": "radial-gradient(circle at 50% 0%, rgba(30, 58, 138, 0.25) 0%, rgba(8, 13, 26, 0.95) 70%)",
        "atmospheric-light": "radial-gradient(circle at 50% 0%, rgba(224, 242, 254, 0.8) 0%, rgba(248, 250, 252, 0.95) 70%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        subtle: "0 2px 12px 0 rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
