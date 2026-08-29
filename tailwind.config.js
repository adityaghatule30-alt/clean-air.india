/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 20px 35px -8px rgba(0, 0, 0, 0.07), 0 10px 15px -5px rgba(0, 0, 0, 0.04)',
        'soft-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
        'glow-amber': '0 12px 30px -6px rgba(245, 158, 11, 0.3)',
        'glow-blue': '0 12px 30px -6px rgba(59, 130, 246, 0.3)',
        'glow-emerald': '0 12px 30px -6px rgba(16, 185, 129, 0.3)',
        'glow-purple': '0 12px 30px -6px rgba(139, 92, 246, 0.3)',
        'glow-rose': '0 12px 30px -6px rgba(244, 63, 94, 0.3)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      animation: {
        float: 'float 3.5s ease-in-out infinite',
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2.5s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite linear',
      }
    },
  },
  plugins: [],
}
