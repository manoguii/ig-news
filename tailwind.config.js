/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          500: '#04d361',
        },
        blue: {
          500: '#61dcfb',
        },
        orange: {
          500: '#FBA94C',
        },
        red: {
          500: '#F75A68',
        },
        gray: {
          title: '#e1e1e6',
          text: '#a8a8b3',
          shape: '#1e2628',
          background: '#121214',
        },
      },
    },
  },
  plugins: [],
}
