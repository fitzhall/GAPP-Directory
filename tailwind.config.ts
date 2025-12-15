import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Calm, trustworthy palette for stressed parents
        primary: {
          DEFAULT: '#2563EB', // Strong blue - trust
          dark: '#1D4ED8',
          light: '#3B82F6',
        },
        accent: {
          DEFAULT: '#059669', // Green - positive/verified
          dark: '#047857',
          light: '#10B981',
        },
        warm: {
          DEFAULT: '#7C3AED', // Purple - featured/premium
          dark: '#6D28D9',
          light: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
