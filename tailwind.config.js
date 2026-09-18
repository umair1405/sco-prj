/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          50: '#FDFBF7',
          100: '#F9F5EE',
          200: '#F1E9DC',
          300: '#E4D5C1',
          400: '#CEB596',
          500: '#B89772',
          600: '#9E7C58',
          700: '#7E6043',
          800: '#54402E',
          900: '#2A1F17',
          950: '#140E0A',
        },
        roseGold: {
          50: '#FFF5F5',
          100: '#FFE6E6',
          200: '#FCD2D2',
          300: '#F5ACAC',
          400: '#E87D7D',
          500: '#D95353',
          600: '#B93636',
          700: '#8E2424',
        },
        champagne: '#EADBC8',
        velvetBlack: '#121212',
        emeraldMuted: '#2D4A3E'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(42, 31, 23, 0.08)',
        'luxury-hover': '0 25px 50px -12px rgba(42, 31, 23, 0.16)',
        'gold-glow': '0 0 25px rgba(184, 151, 114, 0.3)',
      }
    },
  },
  plugins: [],
}
