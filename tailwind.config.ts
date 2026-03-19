import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#09111f',
          blue: '#1d4fff',
          sky: '#6fd3ff',
          lime: '#d7ff5f',
          orange: '#ff6b35',
          sand: '#f7f3e9'
        }
      },
      boxShadow: {
        glow: '0 16px 60px rgba(29, 79, 255, 0.18)'
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseSlow: 'pulse 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
