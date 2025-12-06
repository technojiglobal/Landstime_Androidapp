/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./data/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],

  darkMode: "class",   // ⭐ REQUIRED FIX ⭐

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      screens: {
        xs: { raw: "(max-width: 375px)" },
        sm: { raw: "(min-width: 375px)" },
        md: { raw: "(min-width: 600px)" },
        lg: { raw: "(min-width: 1024px)" },
      },
      spacing: {
        "safe-x": "max(16px, env(safe-area-inset-left))",
        "safe-y": "max(16px, env(safe-area-inset-top))",
      },
      width: {
        "screen-sm": "calc(100% - 32px)",
      },
      height: {
        card: "176px",
        "card-sm": "120px",
        "card-lg": "240px",
      },
    },
  },
  plugins: [],
};
