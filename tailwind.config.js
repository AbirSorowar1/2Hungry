/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tiya: {
          50: '#e0faf6',
          100: '#b3f2ea',
          200: '#7de9db',
          300: '#47e0cc',
          400: '#1ed9c0',
          500: '#00BFA6',
          600: '#00a892',
          700: '#008f7c',
          800: '#007566',
          900: '#005c50',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow': 'float 8s ease-in-out 1s infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-out-right': 'slideOutRight 0.3s ease-in',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'fly-to-cart': 'flyToCart 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(5deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-3deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 191, 166, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 191, 166, 0.8), 0 0 60px rgba(0, 191, 166, 0.3)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        flyToCart: {
          '0%': { transform: 'scale(1) translate(0, 0)', opacity: '1' },
          '50%': { transform: 'scale(0.5) translate(200px, -100px)', opacity: '0.7' },
          '100%': { transform: 'scale(0) translate(400px, -200px)', opacity: '0' },
        },
        skeleton: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 191, 166, 0.4)',
        'glow-lg': '0 0 40px rgba(0, 191, 166, 0.6)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
