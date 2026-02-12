/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cf-gray': '#808080',
        'cf-green': '#00a900',
        'cf-cyan': '#03a89e',
        'cf-blue': '#0000ff',
        'cf-violet': '#a0a',
        'cf-orange': '#ff8c00',
        'cf-red': '#ff0000',
      },
    },
  },
  plugins: [],
}
