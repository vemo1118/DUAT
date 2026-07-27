/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        stone: '#14110F',
        coal: '#1F1B17',
        grave: '#2E2823',
        gold: '#E0A93B',
        ember: '#D9432E',
        bone: '#F0EBE0',
        ash: '#6E675D',
      },
      fontFamily: {
        clash: ['"Clash Display"', '"Space Grotesk"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        kufi: ['"Reem Kufi"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Clash Display"', '"Space Grotesk"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tight: '-0.03em',
        widest: '0.25em',
      },
      lineHeight: {
        display: '0.92',
      }
    },
  },
  plugins: [],
}
