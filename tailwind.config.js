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
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
          dark: '#374151'
        },
        secondary: {
          DEFAULT: '#9CA3AF',
          light: '#D1D5DB',
          dark: '#6B7280'
        },
        accent: '#374151',
        surface: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(107, 114, 128, 0.2), 0 10px 20px -2px rgba(107, 114, 128, 0.1)',
        'card': '0 4px 6px -1px rgba(107, 114, 128, 0.3), 0 2px 4px -2px rgba(107, 114, 128, 0.1)',
        'neu-light': '5px 5px 15px #9CA3AF, -5px -5px 15px #D1D5DB',
        'neu-dark': '5px 5px 15px rgba(107, 114, 128, 0.5), -5px -5px 15px rgba(156, 163, 175, 0.3)',
        'glow': '0 0 20px rgba(107, 114, 128, 0.3), 0 0 40px rgba(107, 114, 128, 0.2)'
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
      },
      backgroundImage: {
        'food-pattern': "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"

      }
    }
  },
  plugins: [],
  darkMode: 'class',
}