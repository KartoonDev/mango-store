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
      fontFamily: {
        sans: ["var(--font-ibm-plex-sans-thai)", "system-ui", "sans-serif"],
        ui: ["var(--font-ibm-plex-sans-thai)", "system-ui", "sans-serif"],
        reading: ["var(--font-sarabun)", "var(--font-ibm-plex-sans-thai)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 41, 55, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
