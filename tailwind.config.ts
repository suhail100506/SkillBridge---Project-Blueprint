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
        brand: {
          50: "var(--brand-50)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
        },
        accent: {
          500: "var(--accent-500)",
          600: "var(--accent-600)",
        },
        warning: "var(--warning)",
        success: "var(--success)",
        info: "var(--info)",
        dark: {
          900: "var(--gray-900)",
          950: "var(--gray-950)",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      }
    },
  },
  plugins: [],
};
export default config;
