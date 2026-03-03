/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Sora"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f7f6f2',
          100: '#e6e1d9',
          200: '#b5b2a3',
          300: '#a7c4b5',
          400: '#7fa99b',
          500: '#4e6e5d',
          600: '#3b4c3f',
          700: '#2e3930',
          800: '#1e2620',
          900: '#151a15',
        },
        surface: {
          DEFAULT: '#ffffff',
          50:  '#f7f6f2',
          100: '#e6e1d9',
          200: '#b5b2a3',
          300: '#a7c4b5',
        },
        danger: '#b23b3b',
        warning: '#e2b659',
        success: '#4e6e5d',
        info: '#7fa99b',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(79,110,93,0.06), 0 1px 2px -1px rgba(79,110,93,0.04)',
        'card-hover': '0 10px 25px -5px rgba(79,110,93,0.08), 0 4px 10px -6px rgba(79,110,93,0.05)',
        'brand': '0 4px 14px 0 rgba(79,110,93,0.25)',
        'brand-lg': '0 8px 30px 0 rgba(79,110,93,0.30)'
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease forwards',
        'fade-in': 'fadeIn 0.25s ease forwards',
        'bounce-dot': 'bounceDot 1.4s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-16px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: 1 },
          '100%': { transform: 'scale(2)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
