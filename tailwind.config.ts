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
        brand: {
          red: "#dd1818",
          redLight: "#f5cfcf",
          green: "#007d13",
          mint: "#c2ffbe",
          grayCard: "#dfdfdf",
          grayBorder: "#a39f9f",
          dark: "#323232",
        },
      },
      fontFamily: {
        albert: ["var(--font-albert)", "sans-serif"],
        redhat: ["var(--font-redhat)", "sans-serif"],
        aclonica: ["var(--font-aclonica)", "sans-serif"],
        alata: ["var(--font-alata)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
