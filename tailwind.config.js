/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: 'rgb(var(--void-rgb) / <alpha-value>)',
        stone: 'rgb(var(--stone-rgb) / <alpha-value>)',
        coal: 'rgb(var(--coal-rgb) / <alpha-value>)',
        grave: 'rgb(var(--grave-rgb) / <alpha-value>)',
        gold: 'rgb(var(--gold-rgb) / <alpha-value>)',
        ember: 'rgb(var(--ember-rgb) / <alpha-value>)',
        bone: 'rgb(var(--bone-rgb) / <alpha-value>)',
        ash: 'rgb(var(--ash-rgb) / <alpha-value>)',
      },
      fontFamily: {
        clash: ['"Clash Display"', '"Space Grotesk"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        kufi: ['"IBM Plex Sans Arabic"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'sans-serif'], // Replaced JetBrains Mono with Space Grotesk sitewide
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
