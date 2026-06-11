import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          150: "#EEF2F7",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
        success: { DEFAULT: "#16A34A", light: "#DCFCE7", dark: "#15803D" },
        warning: { DEFAULT: "#D97706", light: "#FEF3C7", dark: "#B45309" },
        error: { DEFAULT: "#DC2626", light: "#FEE2E2", dark: "#B91C1C" },
        difficulty: {
          easy: "#16A34A",
          "easy-bg": "#DCFCE7",
          medium: "#D97706",
          "medium-bg": "#FEF3C7",
          hard: "#DC2626",
          "hard-bg": "#FEE2E2",
        },
      },
      spacing: {
        sidebar: "260px",
        header: "60px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)",
        focus: "0 0 0 3px rgba(37,99,235,0.15)",
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        lg: "12px",
        xl: "16px",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [],
};

export default config;
