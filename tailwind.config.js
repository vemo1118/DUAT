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
        space: ['"Space Grotesk"', 'sans-serif'],
        kufi: ['"Reem Kufi"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        archivo: ['"Space Grotesk"', 'sans-serif'], // Fallback alias mapped to Space Grotesk
      },
      letterSpacing: {
        tightest: '-0.04em',
        tight: '-0.03em',
        widest: '0.25em',
      },
      lineHeight: {
        display: '0.95',
      }
    },
  },
  plugins: [],
}
