import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        chatHeader:
          "0 12px 28px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        blue: {
          50: "#E4ECF6",
          100: "#CADAED",
          200: "#95B4DB",
          300: "#5F8FC8",
          400: "#3B6DAB",
          500: "#284B75",
          600: "#213D5F",
          700: "#172C44",
          800: "#101D2E",
          900: "#080F17",
          950: "#04070B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
