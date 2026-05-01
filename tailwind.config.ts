import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        leaf: "#2f6b3f",
        mango: "#f2b84b",
        bark: "#7a5138",
        cream: "#fff8e8"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 41, 55, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
