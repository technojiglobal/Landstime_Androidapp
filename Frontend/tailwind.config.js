/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Custom responsive breakpoints for small/medium/large screens
      screens: {
        'xs': { 'raw': '(max-width: 375px)' },     // iPhone SE
        'sm': { 'raw': '(min-width: 375px)' },    // Small phones
        'md': { 'raw': '(min-width: 600px)' },    // Tablets
        'lg': { 'raw': '(min-width: 1024px)' },   // Large tablets
      },
      // Custom sizes that scale well across devices
      spacing: {
        'safe-x': 'max(16px, env(safe-area-inset-left))',
        'safe-y': 'max(16px, env(safe-area-inset-top))',
      },
      // Add custom size utilities for responsive images and components
      width: {
        'screen-sm': 'calc(100% - 32px)', // Full width with safe margins
      },
      height: {
        'card': '176px',
        'card-sm': '120px',
        'card-lg': '240px',
      },
    },
  },
  plugins: [],
}
