/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: 'var(--void)',
        stone: 'var(--stone)',
        coal: 'var(--coal)',
        grave: 'var(--grave)',
        gold: 'var(--gold)',
        ember: 'var(--ember)',
        bone: 'var(--bone)',
        ash: 'var(--ash)',
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
