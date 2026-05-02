import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        leaf: "#237227",
        grove: "#519a66",
        mint: "#ffd786",
        cream: "#ffd786",
        bark: "#174f1c",
        mango: "#ffaa00"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 41, 55, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
