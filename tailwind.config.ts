import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          background: "#0a0f14",
          foreground: "#e6f1ff",
          accent: "#00d084",
          secondary: "#4e6e8e"
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Menlo", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
