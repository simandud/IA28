import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFFBF0',
          100: '#FFF7E6',
          200: '#FFECCC',
          300: '#FFE0B2',
          400: '#FFD580',
          500: '#D4A574',
          600: '#C9935F',
          700: '#B8753F',
          800: '#8B5A2B',
          900: '#5D3A1F',
        },
        vault: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          500: '#1E3A5F',
          700: '#0F172A',
          900: '#0A0E27',
        },
        legacy: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          500: '#6B5B95',
          700: '#4C3561',
        },
      },
      fontFamily: {
        garamond: ['Garamond', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
export default config
