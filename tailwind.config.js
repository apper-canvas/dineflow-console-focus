/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00D4FF',
          light: '#4DE6FF',
          dark: '#0099CC'
        },
        secondary: {
          DEFAULT: '#39FF14',
          light: '#66FF4D',
          dark: '#2BCC0F'
        },
        accent: '#FF1493',
        surface: {
          50: '#0a0a0a',
          100: '#111111',
          200: '#1a1a1a',
          300: '#262626',
          400: '#333333',
          500: '#404040',
          600: '#525252',
          700: '#666666',
          800: '#1a1a1a',
          900: '#000000'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 212, 255, 0.2), 0 10px 20px -2px rgba(0, 212, 255, 0.1)',
        'card': '0 4px 6px -1px rgba(0, 212, 255, 0.3), 0 2px 4px -2px rgba(0, 212, 255, 0.1)',
        'neu-light': '5px 5px 15px #00D4FF, -5px -5px 15px #39FF14',
        'neu-dark': '5px 5px 15px rgba(0, 212, 255, 0.5), -5px -5px 15px rgba(57, 255, 20, 0.3)',
        'glow': '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(0, 212, 255, 0.4)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-gentle': 'bounce 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}