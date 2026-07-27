/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: '#0A0C16',
        twilight: '#161A32',
        indigo: '#232A55',
        amber: {
          DEFAULT: '#E8A33D',
          deep: '#C97B22',
        },
        rose: '#E0917A',
        bone: {
          DEFAULT: '#EDE4D3',
          dim: '#9A9384',
        },
        // Backwards compatibility tokens mapped to Dawn palette
        void: '#0A0C16',
        stone: '#161A32',
        coal: '#12152B',
        grave: 'rgba(237,228,211,0.12)',
        gold: '#E8A33D',
        ember: '#E0917A',
        ash: '#9A9384',
      },
      fontFamily: {
        anton: ['"Anton"', 'sans-serif'],
        cairo: ['"Cairo"', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        archivo: ['"Anton"', 'sans-serif'], // Fallback alias
      },
    },
  },
  plugins: [],
}
