import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        leaf: "#346739",
        grove: "#79ae6f",
        mint: "#9fcb98",
        cream: "#f2edc2",
        bark: "#29442c",
        mango: "#f2edc2"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 41, 55, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
