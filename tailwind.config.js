/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        subColor3: '#B1E1FF',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        light: '#f8f9fa',
        dark: '#343a40',
      },
      fontFamily: {
        sans: ['Spoqa Han Sans Neo', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
            animation: {
              'fade-in-up': 'fadeInUp 0.8s ease-out',
              'pulse-custom': 'pulseCustom 2s infinite',
              'move-right': 'moveRight 150s linear infinite',
              'scroll-up': 'scrollUp 20s linear infinite',
              'wave': 'wave 0.8s ease-in-out infinite',
              'spin': 'spin 1s linear infinite',
              'shimmer': 'shimmer 3s ease-in-out infinite',
              'blob': 'blob 7s infinite',
              'fadeIn': 'fadeIn 0.5s ease-in',
            },
            keyframes: {
              fadeInUp: {
                'from': {
                  opacity: '0',
                  transform: 'translateY(30px)',
                },
                'to': {
                  opacity: '1',
                  transform: 'translateY(0)',
                },
              },
              fadeIn: {
                'from': {
                  opacity: '0',
                },
                'to': {
                  opacity: '1',
                },
              },
              pulseCustom: {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)',
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)',
                },
              },
              moveRight: {
                '0%': {
                  transform: 'translateX(-100%)',
                },
                '100%': {
                  transform: 'translateX(100%)',
                },
              },
              scrollUp: {
                '0%': {
                  transform: 'translateY(0)',
                },
                '100%': {
                  transform: 'translateY(calc(-100% + 180px))',
                },
              },
              wave: {
                '0%, 100%': {
                  transform: 'translateY(0px)',
                },
                '50%': {
                  transform: 'translateY(-8px)',
                },
              },
              spin: {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
              shimmer: {
                '0%, 100%': {
                  backgroundPosition: '0% 50%',
                },
                '50%': {
                  backgroundPosition: '100% 50%',
                },
              },
              blob: {
                '0%': {
                  transform: 'translate(0px, 0px) scale(1)',
                },
                '33%': {
                  transform: 'translate(30px, -50px) scale(1.1)',
                },
                '66%': {
                  transform: 'translate(-20px, 20px) scale(0.9)',
                },
                '100%': {
                  transform: 'translate(0px, 0px) scale(1)',
                },
              },
            }
    },
  },
  plugins: [],
}
