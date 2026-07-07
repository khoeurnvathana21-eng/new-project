// ============================================================
// BootZone Client - Tailwind CSS Configuration
// File: client/tailwind.config.js
// 8-point spacing grid, custom BootZone design system
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // BootZone brand palette
        ink: {
          50: '#f6f7f8',
          100: '#eceef1',
          200: '#d5d9df',
          300: '#aeb4bd',
          400: '#828a96',
          500: '#5f6772',
          600: '#4a515b',
          700: '#3d434b',
          800: '#2c3036',
          900: '#1a1d21',
          950: '#0d0f11',
        },
        flame: {
          50: '#fff5ed',
          100: '#ffe8d3',
          200: '#ffcea5',
          300: '#ffac6c',
          400: '#ff7e33',
          500: '#ff5b0d',
          600: '#f03e06',
          700: '#c72d08',
          800: '#9e250e',
          900: '#7f2110',
        },
        pitch: {
          50: '#f0f9f4',
          100: '#dcf0e3',
          200: '#bbe0cb',
          300: '#8acaa6',
          400: '#54ab7d',
          500: '#328d61',
          600: '#23714c',
          700: '#1d5a3e',
          800: '#194833',
          900: '#153c2b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bebas Neue"', 'Inter', 'sans-serif'],
      },
      spacing: {
        // 8-point grid
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '38': '9.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(13,15,17,0.04), 0 4px 12px rgba(13,15,17,0.06)',
        cardHover: '0 4px 8px rgba(13,15,17,0.08), 0 12px 28px rgba(13,15,17,0.10)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
