import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
        },
        accent: {
          DEFAULT: "#F97316",
          light: "#FB923C",
          dark: "#EA580C",
        },
        surface: {
          DEFAULT: "#ffffff",
          secondary: "#f8fafc",
          tertiary: "#f3f4f6",
        },
        text: {
          primary: "#111827",
          secondary: "#4b5563",
          tertiary: "#6b7280",
          inverted: "#ffffff",
        },
        border: {
          DEFAULT: "#e5e7eb",
          light: "#f3f4f6",
        },
        dark: {
          DEFAULT: "#0F172A",
          lighter: "#1E293B",
          card: "#1E293B",
        },
        tag: {
          blue: { bg: "#eff6ff", text: "#2563eb" },
          purple: { bg: "#faf5ff", text: "#9333ea" },
          teal: { bg: "#ecfeff", text: "#0891b2" },
          orange: { bg: "#fff7ed", text: "#ea580c" },
          green: { bg: "#f0fdf4", text: "#16a34a" },
          rose: { bg: "#fff1f2", text: "#e11d48" },
        },
      },
    },
  },
  plugins: [],
};

export default config;