module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pillar1: {
          primary: '#1e4a7a',
          secondary: '#2e6aa7',
          accent: '#3d8bd4',
        },
        pillar2: {
          primary: '#6b21a8',
          secondary: '#8b3cc4',
          accent: '#aa57e0',
        },
        pillar3: {
          primary: '#b8860b',
          secondary: '#daa520',
          accent: '#ffd700',
        },
        pillar4: {
          primary: '#8b5a2b',
          secondary: '#a67c45',
          accent: '#c19a6b',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}