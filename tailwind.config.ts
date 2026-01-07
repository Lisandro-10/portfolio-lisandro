import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", 'html[class~="dark"]'],
  theme: {
    extend: {
      colors: {
        // Paleta original del usuario (sin cambios)
        primary: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
        },
        secondary: {
          DEFAULT: "#F97316",
          light: "#FDBA74",
          dark: "#EA580C",
        },
        dark: {
          DEFAULT: "#000",
          lighter: "#334155",
          darker: "#0F172A",
        },
        
        // Colores adicionales para light theme (usando slate de Tailwind)
        light: {
          DEFAULT: "#ffffff",
          secondary: "#f1f5f9",  // slate-100
          tertiary: "#f8fafc",   // slate-50
        },
        
        // Text colors organizados por theme
        text: {
          dark: {
            primary: "#ffffff",
            secondary: "#d1d5db",   // gray-300
            tertiary: "#9ca3af",    // gray-400
          },
          light: {
            primary: "#0F172A",     // slate-900 (mismo que dark.darker)
            secondary: "#334155",   // slate-700 (mismo que dark.lighter)
            tertiary: "#64748b",    // slate-500
          },
        },
        
        // Border colors
        border: {
          dark: "#334155",    // dark.lighter
          light: "#e2e8f0",   // slate-200
        },
        
        // Filter-specific colors (para la solución del hover)
        filter: {
          hover: {
            dark: "#334155",    // dark.lighter
            light: "#f1f5f9",   // slate-100
          },
          selected: {
            dark: "#1e3a8a",    // blue-900 (consistente con primary)
            light: "#dbeafe",   // blue-100 (consistente con primary)
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;