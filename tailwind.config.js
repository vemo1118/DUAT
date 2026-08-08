/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: 'rgb(var(--void-rgb, 10 12 22) / <alpha-value>)',
        stone: 'rgb(var(--stone-rgb, 18 22 43) / <alpha-value>)',
        coal: 'rgb(var(--coal-rgb, 24 30 59) / <alpha-value>)',
        grave: 'rgb(var(--grave-rgb, 40 48 95) / <alpha-value>)',
        gold: 'rgb(var(--gold-rgb, 232 163 61) / <alpha-value>)',
        ember: 'rgb(var(--ember-rgb, 217 67 46) / <alpha-value>)',
        bone: 'rgb(var(--bone-rgb, 237 228 211) / <alpha-value>)',
        ash: 'rgb(var(--ash-rgb, 142 152 191) / <alpha-value>)',
      },
      fontFamily: {
        clash: ['"Clash Display"', '"Space Grotesk"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        kufi: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Clash Display"', '"Space Grotesk"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tight: '-0.03em',
        widest: '0.12em',
      },
      lineHeight: {
        display: '0.92',
      }
    },
  },
  plugins: [],
}
