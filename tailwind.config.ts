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
        // GeorgiaGAPP Brand Colors
        primary: {
          DEFAULT: '#FF8A80', // Coral Pink - care, compassion, CTAs
          dark: '#E57373',
          light: '#FFAB91',
        },
        accent: {
          DEFAULT: '#87CEEB', // Sky Blue - trust, healthcare reliability
          dark: '#5DADE2',
          light: '#AED6F1',
        },
        warm: {
          DEFAULT: '#FFCBA4', // Soft Peach - warmth, comfort
          dark: '#FFB380',
          light: '#FFE0C7',
        },
        navy: {
          DEFAULT: '#2C3E50', // Navy Blue - professionalism, text
          dark: '#1A252F',
          light: '#34495E',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
